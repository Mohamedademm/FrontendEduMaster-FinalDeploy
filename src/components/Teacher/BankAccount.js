import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import "../../Css/Teacher/BankAccount.css";
import { Button, TextField, MenuItem, Select, InputLabel, FormControl } from "@mui/material";

const BankAccount = () => {
  const [accountDetails, setAccountDetails] = useState({
    accountNumber: "",
    bankName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    profession: ""
  });
  const [isEditable, setIsEditable] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    // Fetch bank account details
    const teacherId = localStorage.getItem('teacherId');
    axios.get(`http://localhost:3000/api/bank-accounts/${teacherId}`).then((response) => {
      if (response.data) {
        setAccountDetails(response.data);
      }
    }).catch(error => {
      console.error('Error fetching bank account details:', error);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAccountDetails({ ...accountDetails, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (window.confirm(t('confirm_modify'))) {
      const teacherId = localStorage.getItem('teacherId');
      const apiEndpoint = `http://localhost:3000/api/bank-accounts/${teacherId}`;
      
      axios.put(apiEndpoint, { ...accountDetails }).then((response) => {
        alert(t('details_saved_successfully'));
        setIsEditable(false);
      }).catch(error => {
        console.error('Error saving bank account details:', error);
        alert(t('error_saving_details'));
      });
    }
  };

  const handleFieldClick = () => {
    setIsEditable(true);
  };

  return (
    <div className="bank-account">
      <header className="header">
        <h1>{t('BankAccount')}</h1>
        <p>{t('fill_bank_details')}</p>
      </header>

      <form className="account-form" onSubmit={handleSubmit}>
        <TextField
          label={t('account_number')}
          name="accountNumber"
          value={accountDetails.accountNumber}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled={!isEditable}
          onClick={handleFieldClick}
        />
        <TextField
          label={t('bank_name')}
          name="bankName"
          value={accountDetails.bankName}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled={!isEditable}
          onClick={handleFieldClick}
        />
        <TextField
          label={t('card_number')}
          name="cardNumber"
          value={accountDetails.cardNumber}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled={!isEditable}
          onClick={handleFieldClick}
        />
        <TextField
          label={t('expiry_date')}
          name="expiryDate"
          value={accountDetails.expiryDate}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled={!isEditable}
          onClick={handleFieldClick}
        />
        <TextField
          label={t('cvv')}
          name="cvv"
          value={accountDetails.cvv}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled={!isEditable}
          onClick={handleFieldClick}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>{t('profession')}</InputLabel>
          <Select
            name="Security"
            value={accountDetails.profession}
            onChange={handleChange}
            disabled={!isEditable}
            onClick={handleFieldClick}
          >
            <MenuItem value="update BankAcount">{t('update BankAcount')}</MenuItem>
            
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary">
          {t('submit')}
        </Button>
      </form>
    </div>
  );
};

export default BankAccount;
