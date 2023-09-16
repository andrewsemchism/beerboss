import React, { useEffect, useState } from 'react';
import styles from './PreviewCard.module.css';

interface PreviewCardProps {
  title: string;
  imageUrl: string;
  description: string;
  clickHandler?: () => void;
}

const PreviewCard: React.FC<PreviewCardProps> = ({
  title,
  imageUrl,
  description,
  clickHandler,
}) => {

  const hasClickHandler = !!clickHandler;

  const clickableClass = hasClickHandler ? styles.clickable : '';

  return (
    <div className={`${styles.cardContainer} ${clickableClass}`} onClick={clickHandler}>
      <div className={styles.cardTitleBox}>
        <div className={styles.cardImage}>
          <img src={imageUrl} alt={title} />
        </div>
        <h2 className={styles.cardTitle}>{title}</h2>
      </div>
      <div className={styles.cardContent}>
        <p className={styles.cardDescription}>{description}</p>
      </div>
    </div>
  );
};

export default PreviewCard;