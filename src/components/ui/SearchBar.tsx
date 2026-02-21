'use client';

import { useState, useEffect } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import styles from './search.module.css';

interface SearchBarProps {
    placeholder: string;
    onSearch: (query: string) => void;
    initialValue?: string;
}

export default function SearchBar({ placeholder, onSearch, initialValue = '' }: SearchBarProps) {
    const [query, setQuery] = useState(initialValue);

    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(query);
        }, 500);

        return () => clearTimeout(timer);
    }, [query, onSearch]);

    return (
        <div className={styles.searchContainer}>
            <FiSearch className={styles.searchIcon} />
            <input
                type="text"
                className={styles.searchInput}
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
                <button className={styles.clearButton} onClick={() => setQuery('')}>
                    <FiX />
                </button>
            )}
        </div>
    );
}
