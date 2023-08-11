import React from 'react';
import styles from './FilterButton.module.css';
import { on } from 'events';

interface FilterButtonProps {
  width: string;
  text: string;
  isEnabled: boolean;
  onClick: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ width, text, isEnabled, onClick }) => {
  const buttonStyle: React.CSSProperties = {
    width: width,
  };

  return (
    <button
      className={`${styles.filterButton} ${isEnabled ? styles.enabled : styles.disabled}`}
      style={buttonStyle}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default FilterButton;
