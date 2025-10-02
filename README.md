# EduMaster Frontend

Interface utilisateur React.js pour EduMaster - Plateforme éducative innovante.

## 🚀 Déploiement

Cette application React est configurée pour être déployée sur **Netlify** (gratuit).

### Variables d'environnement requises :

```env
REACT_APP_API_URL=https://your-backend.onrender.com/api
REACT_APP_BACKEND_URL=https://your-backend.onrender.com
REACT_APP_FRONTEND_URL=https://your-app.netlify.app
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_PAYPAL_CLIENT_ID=your_paypal_client_id
```

### Configuration Netlify :

- **Build Command**: `npm run build`
- **Publish Directory**: `build`
- **Node Version**: 18

### Fonctionnalités :

- ✅ Interface utilisateur moderne avec React 18
- ✅ Design responsive avec Tailwind CSS + Bootstrap
- ✅ Authentification Google OAuth
- ✅ Tableaux de bord interactifs
- ✅ Gestion des cours et roadmaps
- ✅ Chat IA intégré (Gemini)
- ✅ Paiements PayPal intégrés
- ✅ Upload de fichiers
- ✅ Support multi-langues (i18n)
- ✅ Graphiques et visualisations (Recharts)
- ✅ Animations fluides (Framer Motion)

## 🔧 Installation locale

```bash
npm install
npm start
```

L'app sera disponible sur `http://localhost:3005`

## 🛠️ Technologies

- **React 18** - Framework frontend
- **React Router** - Navigation
- **Axios** - API calls
- **Tailwind CSS** - Styling
- **Material-UI** - Composants UI
- **Framer Motion** - Animations
- **Recharts** - Graphiques
- **i18next** - Internationalisation

## 📱 Pages principales

- `/` - Accueil
- `/dashboard` - Tableau de bord
- `/courses` - Catalogue de cours
- `/roadmaps` - Parcours d'apprentissage
- `/profile` - Profil utilisateur
- `/chat` - Chat IA

---

**🎓 EduMaster - L'éducation réinventée !**