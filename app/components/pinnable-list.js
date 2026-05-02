"use client";

import { useEffect, useMemo, useState } from 'react';

export default function PinnableList({ items, storageKey, emptyLabel }) {
  const [pinnedId, setPinnedId] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const stored = window.localStorage.getItem(storageKey);
    if (stored) {
      setPinnedId(stored);
    }
  }, [storageKey]);

  const orderedItems = useMemo(() => {
    if (!pinnedId) {
      return items;
    }

    const pinned = items.find((item) => item.id === pinnedId);
    if (!pinned) {
      return items;
    }

    return [pinned, ...items.filter((item) => item.id !== pinnedId)];
  }, [items, pinnedId]);

  const togglePinned = (id) => {
    setPinnedId((current) => {
      const next = current === id ? null : id;

      if (typeof window !== 'undefined') {
        if (next) {
          window.localStorage.setItem(storageKey, next);
        } else {
          window.localStorage.removeItem(storageKey);
        }
      }

      return next;
    });
  };

  if (!orderedItems.length) {
    return <p className="empty-state">{emptyLabel}</p>;
  }

  return (
    <div className="pinned-list">
      {orderedItems.map((item) => {
        const isPinned = item.id === pinnedId;

        return (
          <article className={`pinned-card${isPinned ? ' is-pinned' : ''}`} key={item.id}>
            <header>
              <div>
                <strong>{item.title}</strong>
                {item.link ? (
                  <a className="pinned-link" href={item.link} target="_blank" rel="noopener noreferrer">
                    {item.linkLabel}
                  </a>
                ) : (
                  <span className="pinned-link">{item.linkLabel}</span>
                )}
              </div>
              <div className="pin-actions">
                {item.status ? (
                  <span className={`status-pill ${item.statusTone || 'neutral'}`}>{item.status}</span>
                ) : null}
                <button
                  className="pin-button"
                  type="button"
                  onClick={() => togglePinned(item.id)}
                  aria-pressed={isPinned}
                >
                  {isPinned ? 'Unpin' : 'Pin to top'}
                </button>
              </div>
            </header>
            {item.meta ? <p className="pinned-meta">{item.meta}</p> : null}
            {item.detail ? <p className="pinned-detail">{item.detail}</p> : null}
          </article>
        );
      })}
    </div>
  );
}
