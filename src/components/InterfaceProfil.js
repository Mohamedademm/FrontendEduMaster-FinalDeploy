import React, { useState } from 'react';
import '../Css/interfaceProfil.css';

const InterfaceProfil = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Traitement de la soumission du formulaire
    console.log('Profile updated:', profile);
  };

  return (
    <div className="interface-profil">
      <h2>Mettre à jour vos informations personnelles</h2>
      <form onSubmit={handleSubmit} className="profil-form">
        <div className="form-group">
          <label htmlFor="name">Nom et Prénom :</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            value={profile.name} 
            onChange={handleChange} 
            placeholder="Votre nom complet" 
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Adresse Email :</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={profile.email} 
            onChange={handleChange} 
            placeholder="Votre adresse email" 
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Téléphone :</label>
          <input 
            type="tel" 
            id="phone" 
            name="phone" 
            value={profile.phone} 
            onChange={handleChange} 
            placeholder="Votre numéro de téléphone" 
          />
        </div>
        <div className="form-group">
          <label htmlFor="avatar">Photo de Profil :</label>
          <input 
            type="text" 
            id="avatar" 
            name="avatar" 
            value={profile.avatar} 
            onChange={handleChange} 
            placeholder="URL de votre avatar" 
          />
        </div>
        <button type="submit" className="submit-btn">Enregistrer</button>
      </form>
    </div>
  );
};

export default InterfaceProfil;
