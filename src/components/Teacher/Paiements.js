import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import "../../Css/Teacher/PaiementsG.css";
import { FaHistory } from "react-icons/fa";

const Paiements = () => {
  const { t } = useTranslation();
  const [selectedCard, setSelectedCard] = useState("");

  const handleCardSelect = (card) => {
    setSelectedCard(card);
  };

  return (
    <div className="paiements-g">
      <header className="header">
        <h1>{t('PaiementsG')}</h1>
        <p>{t('payment_history')}</p>
      </header>

      <section className="card-selection">
        <h2>{t('select_card')}</h2>
        <div className="card-container">
          <div
            className={`credit-card ${selectedCard === "card1" ? "selected" : ""}`}
            onClick={() => handleCardSelect("card1")}
          ></div>
          <div
            className={`credit-card ${selectedCard === "card2" ? "selected" : ""}`}
            onClick={() => handleCardSelect("card2")}
          ></div>
          {/* Add more cards as needed */}
        </div>
      </section>

      <section className="payment-history">
        <h2>{t('payment_history')}</h2>
        <div className="history-list">
          {/* Payment history items will be displayed here */}
          <div className="history-item">
            <FaHistory className="history-icon" />
            <p>{t('payment')} 1 - $100</p>
          </div>
          <div className="history-item">
            <FaHistory className="history-icon" />
            <p>{t('payment')} 2 - $200</p>
          </div>
          {/* Add more history items as needed */}
        </div>
      </section>
    </div>
  );
};

export default Paiements;
