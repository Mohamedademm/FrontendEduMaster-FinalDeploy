import React from "react";
import { 
  Article, 
  VideoLibrary, 
  PictureAsPdf, 
  Image, 
  Quiz,
  Timer,
  CheckCircle,
  RadioButtonUnchecked,
  PlayCircleFilled,
  Description,
  Visibility
} from "@mui/icons-material";
import { Paper, Chip, Divider } from "@mui/material";

const ContentDisplay = ({ selectedItem }) => {
  if (!selectedItem) {
    return (
      <Paper className="content-placeholder" elevation={2}>
        <div className="placeholder-content">
          <Visibility className="placeholder-icon" />
          <h3>Aucun élément sélectionné</h3>
          <p>Sélectionnez un micro-cours ou un test depuis la sidebar pour voir son contenu.</p>
        </div>
      </Paper>
    );
  }

  // Special handling for test type items
  if (selectedItem.type === "test") {
    return (
      <Paper className="test-content" elevation={2}>
        <div className="content-header">
          <div className="title-section">
            <Quiz className="content-icon" />
            <h3>{selectedItem.title}</h3>
          </div>
          <Chip 
            icon={<Timer />} 
            label={`${selectedItem.timer} minutes`}
            color="primary"
            variant="outlined"
          />
        </div>

        <Divider className="content-divider" />

        <div className="questions-container">
          {selectedItem.questions && selectedItem.questions.length > 0 ? (
            selectedItem.questions.map((question, qIndex) => (
              <Paper key={qIndex} className="question-preview" elevation={1}>
                <div className="question-header">
                  <Chip 
                    label={`Question ${qIndex + 1}`}
                    color="secondary"
                    size="small"
                  />
                </div>
                <h4 className="question-text">{question.question}</h4>
                <div className="options-list">
                  {question.options && question.options.map((option, oIndex) => (
                    <div 
                      key={oIndex} 
                      className={`option-item ${question.correctOption === oIndex ? 'correct-option' : ''}`}
                    >
                      {question.correctOption === oIndex ? 
                        <CheckCircle className="option-icon correct" /> : 
                        <RadioButtonUnchecked className="option-icon" />
                      }
                      <span>{option}</span>
                    </div>
                  ))}
                </div>
              </Paper>
            ))
          ) : (
            <div className="no-questions">
              <p>Aucune question disponible pour ce test.</p>
            </div>
          )}
        </div>
      </Paper>
    );
  }
  if (!selectedItem.contents || selectedItem.contents.length === 0) {
    return (
      <Paper className="content-placeholder" elevation={2}>
        <div className="placeholder-content">
          <Article className="placeholder-icon" />
          <h3>Contenu introuvable</h3>
          <p>Le contenu de ce micro-cours est introuvable ou vide.</p>
        </div>
      </Paper>
    );
  }

  const formatTextContent = (text) => {
    if (!text) return null;
    return text.split("\n").map((line, index) => (
      <p key={index} style={{ marginBottom: "1em", lineHeight: "1.6" }}>
        {line}
      </p>
    ));
  };

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return "";
    
    try {
      // Handle youtu.be links
      if (url.includes("youtu.be/")) {
        const videoId = url.split("youtu.be/")[1].split("?")[0];
        return `https://www.youtube.com/embed/${videoId}`;
      }
      
      // Handle youtube.com links
      if (url.includes("youtube.com/watch")) {
        const videoId = new URL(url).searchParams.get("v");
        return `https://www.youtube.com/embed/${videoId}`;
      }
      
      // If it's already an embed URL or invalid, return as is
      return url;
    } catch (error) {
      console.error("Error processing YouTube URL:", error);
      return url; // Return original URL if there's an error
    }
  };
  const getContentIcon = (type) => {
    switch (type) {
      case "text":
        return <Article className="content-type-icon" />;
      case "image":
        return <Image className="content-type-icon" />;
      case "video":
        return <VideoLibrary className="content-type-icon" />;
      case "youtube":
        return <PlayCircleFilled className="content-type-icon" />;
      case "pdf":
        return <PictureAsPdf className="content-type-icon" />;
      default:
        return <Description className="content-type-icon" />;
    }
  };

  const getContentTypeLabel = (type) => {
    switch (type) {
      case "text":
        return "Texte";
      case "image":
        return "Image";
      case "video":
        return "Vidéo";
      case "youtube":
        return "YouTube";
      case "pdf":
        return "PDF";
      default:
        return "Contenu";
    }
  };

  return (
    <Paper className="micro-course-content" elevation={2}>
      <div className="content-header">
        <div className="title-section">
          <Article className="content-icon" />
          <h3>{selectedItem.title}</h3>
        </div>
        <Chip 
          label={`${selectedItem.contents.length} élément${selectedItem.contents.length > 1 ? 's' : ''}`}
          color="primary"
          variant="outlined"
        />
      </div>

      <Divider className="content-divider" />

      <div className="contents-container">
        {selectedItem.contents.map((content, index) => (
          <Paper key={index} className="content-item-display" elevation={1}>
            <div className="content-item-header">
              <div className="content-type-section">
                {getContentIcon(content.type)}
                <Chip 
                  label={getContentTypeLabel(content.type)}
                  color="secondary"
                  size="small"
                />
              </div>
              <Chip 
                label={`${index + 1}/${selectedItem.contents.length}`}
                variant="outlined"
                size="small"
              />
            </div>

            <div className="content-body">
              {content.type === "text" && (
                <div className="text-content">
                  {formatTextContent(content.value)}
                </div>
              )}
              
              {content.type === "image" && (
                <div className="image-content">
                  <img
                    src={content.value}
                    alt={`Content ${index + 1}`}
                    className="content-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/path-to-fallback-image.jpg";
                      console.error("Erreur de chargement de l'image:", content.value);
                    }}
                  />
                </div>
              )}
              
              {content.type === "video" && (
                <div className="video-content">
                  <video 
                    controls 
                    className="content-video"
                    onError={(e) => {
                      console.error("Erreur de chargement de la vidéo:", content.value);
                    }}
                  >
                    <source src={content.value} type="video/mp4" />
                    <source src={content.value} type="video/webm" />
                    <source src={content.value} type="video/ogg" />
                    Votre navigateur ne supporte pas les vidéos.
                  </video>
                </div>
              )}
              
              {content.type === "youtube" && (
                <div className="youtube-content">
                  <iframe
                    src={getYoutubeEmbedUrl(content.value)}
                    title={`YouTube Video ${index + 1}`}
                    className="youtube-iframe"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
              
              {content.type === "pdf" && (
                <div className="pdf-content">
                  <iframe
                    src={content.value}
                    title={`PDF Viewer ${index + 1}`}
                    className="pdf-iframe"
                  ></iframe>
                </div>
              )}
            </div>
          </Paper>
        ))}
      </div>
    </Paper>
  );
};

export default ContentDisplay;