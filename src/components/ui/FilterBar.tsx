'use client';

import styles from './search.module.css';

interface FilterBarProps {
    categories: string[];
    selectedCategory: string;
    onSelect: (category: string) => void;
}

export default function FilterBar({ categories, selectedCategory, onSelect }: FilterBarProps) {
    return (
        <div className={styles.filterContainer}>
            {categories.map((category) => (
                <button
                    key={category}
                    className={`${styles.filterButton} ${selectedCategory === category ? styles.active : ''}`}
                    onClick={() => onSelect(category)}
                >
                    {category}
                </button>
            ))}
        </div>
    );
}
