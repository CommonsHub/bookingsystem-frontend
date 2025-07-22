import { useEffect, useMemo, useState } from 'react';
import { fetchAndParseICSEvents, augmentICSEventsWithLumaImage } from '@/lib/ics-utils';
import type { AugmentedICSEvent } from '@/lib/ics-utils';
import type { ICSEvent } from '@/lib/ics-types';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import type { DateRange } from 'react-day-picker';

const DEFAULT_ICS_URL = import.meta.env.VITE_ICS_URL || 'https://api.lu.ma/ics/get?entity=calendar&id=cal-kWlIiw3HsJFhs25';
const CORS_PROXY = 'https://corsproxy.io/?';

function formatEventMarkdown(event: AugmentedICSEvent) {
  const imageMarkdown = event.image ? `![Event image](${event.image.url})` : '';
  return [
    imageMarkdown,
    `### ${event.summary}`,
    event.isAllDay ? `- **All Day**` : `- **Start:** ${formatDate(event.start, event.startTzid)}`,
    !event.isAllDay ? `- **End:** ${formatDate(event.end, event.endTzid)}` : '',
    event.location ? `- **Location:** ${event.location}` : '',
    event.description ? `\n${event.description}` : '',
  ].filter(Boolean).join('\n');
}

function formatDate(value: string, tzid?: string) {
  if (!value) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    // Date only
    return value + (tzid ? ` (${tzid})` : '');
  }
  // Unix timestamp in seconds
  const date = new Date(Number(value) * 1000);
  return date.toLocaleString() + (tzid ? ` (${tzid})` : '');
}

function withCorsProxy(url: string) {
  if (!url) return url;
  // Only proxy http(s) URLs that are not already proxied
  if ((url.startsWith('http://') || url.startsWith('https://')) && !url.startsWith(CORS_PROXY)) {
    return CORS_PROXY + encodeURIComponent(url);
  }
  return url;
}

const ICSPreviewPage = () => {
  const [icsUrl, setIcsUrl] = useState<string | null>(null);
  const [inputUrl, setInputUrl] = useState(DEFAULT_ICS_URL);
  const [events, setEvents] = useState<AugmentedICSEvent[]>([]);
  const [rawEvents, setRawEvents] = useState<ICSEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedUid, setCopiedUid] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  // Date filter state
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  // Set default date range on mount
  useEffect(() => {
    const today = new Date();
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    setDateRange({ from: today, to: endOfMonth });
  }, []);

  useEffect(() => {
    if (!icsUrl) return;
    setLoading(true);
    setError(null);
    fetchAndParseICSEvents(withCorsProxy(icsUrl))
      .then(setRawEvents)
      .catch((err) => setError(err.message || 'Failed to fetch ICS events'))
      .finally(() => setLoading(false));
  }, [icsUrl]);

  // Filter raw events by date range
  const filteredRawEvents = useMemo(() => rawEvents.filter(event => {
    if (!dateRange?.from || !dateRange?.to) return true;
    let eventStart: Date;
    if (/^\d{4}-\d{2}-\d{2}$/.test(event.start)) {
      eventStart = new Date(event.start);
    } else {
      eventStart = new Date(Number(event.start) * 1000);
    }
    
    console.log(eventStart, dateRange.from, dateRange.to);
    return eventStart >= dateRange.from && eventStart <= dateRange.to;
  }), [rawEvents, dateRange]);

  useEffect(() => {
    if (!filteredRawEvents.length) return;
    setLoading(true);
    augmentICSEventsWithLumaImage(filteredRawEvents)
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [filteredRawEvents]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIcsUrl(inputUrl.trim());
  };

  const handleCopy = async (markdown: string, uid: string) => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopiedUid(uid);
      setTimeout(() => setCopiedUid(null), 1200);
    } catch (e) {
      // fallback or error
    }
  };

  const handleCopyAll = async () => {
    const allMarkdown = events.map(formatEventMarkdown).join('\n\n');
    try {
      await navigator.clipboard.writeText(allMarkdown);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 1200);
    } catch (e) {
      // fallback or error
    }
  };

  // No need to filter events again, just use 'events' as the filtered & augmented list

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">ICS Events Preview</h1>
      <form onSubmit={handleSubmit} className="mb-4 flex flex-col sm:flex-row gap-2 items-start sm:items-end">
        <div className="flex-1 w-full">
          <label htmlFor="ics-url" className="block text-sm font-medium text-gray-700 mb-1">ICS URL</label>
          <input
            id="ics-url"
            type="url"
            className="w-full border rounded px-3 py-2 text-sm"
            value={inputUrl}
            onChange={e => setInputUrl(e.target.value)}
            placeholder="Paste your ICS feed URL here"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded mt-2 sm:mt-0 sm:ml-2"
          disabled={loading || !inputUrl.trim()}
        >
          Load Events
        </button>
      </form>
      {/* Date filter UI */}
      <div className="mb-4">
        <Label className="block mb-1">Date Range</Label>
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={setDateRange}
          numberOfMonths={2}
        />
        <div className="text-xs text-gray-500 mt-1">
          Showing events from {dateRange?.from ? dateRange.from.toLocaleDateString() : '...'} to {dateRange?.to ? dateRange.to.toLocaleDateString() : '...'}
        </div>
      </div>
      <p className="mb-4 text-gray-600">Source: <code>{icsUrl || 'No ICS URL loaded'}</code></p>
      {icsUrl && events.length > 0 && (
        <button
          onClick={handleCopyAll}
          className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          {copiedAll ? 'Copied!' : 'Copy whole calendar in markdown'}
        </button>
      )}
      {loading && <p>Loading events...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {icsUrl && !loading && !error && events.length === 0 && <p>No events found.</p>}
      <div className="prose prose-sm max-w-none">
        {events.map((event) => {
          const markdown = formatEventMarkdown(event);
          return (
            <div
              key={event.uid}
              className="border rounded-lg p-4 mb-6 bg-white relative shadow-sm"
              style={{ position: 'relative' }}
            >
              <button
                onClick={() => handleCopy(markdown, event.uid)}
                className="absolute top-3 right-3 bg-gray-100 border border-gray-300 rounded px-2 py-1 text-xs hover:bg-gray-200 transition"
                aria-label="Copy markdown"
              >
                {copiedUid === event.uid ? 'Copied!' : 'Copy'}
              </button>
              {event.image && (
                <img
                  src={event.image.url}
                  width={event.image.width}
                  height={event.image.height}
                  alt="Event visual"
                  style={{ maxWidth: '100%', marginBottom: 12, borderRadius: 8 }}
                />
              )}
              <pre style={{ whiteSpace: 'pre-wrap', marginBottom: 0 }}>
                {markdown}
              </pre>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ICSPreviewPage; 