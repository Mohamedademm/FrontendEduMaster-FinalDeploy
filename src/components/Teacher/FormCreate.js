import React, { useState, useEffect } from "react";
import { 
  AddCircleOutline, 
  CloudUpload, 
  VideoLibrary, 
  TextFields,
  Quiz,
  Save,
  Timer,
  LibraryBooks,
  Image,
  PictureAsPdf,
  YouTube,
  Delete,
  DragIndicator
} from "@mui/icons-material";
import { 
  IconButton, 
  Button, 
  Chip, 
  Tooltip, 
  Paper,
  Divider,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel
} from "@mui/material";

const FormCreate = ({
  courseId,
  handleAddMicroCourse,
  handleAddTestAtPosition,
  initialData = null,
  isEditing = false,
}) => {const [newTitle, setNewTitle] = useState(initialData?.title || "");
  const [contents, setContents] = useState(initialData?.contents || []);
  const [insertIndex, setInsertIndex] = useState(null);

  const [newTestTitle, setNewTestTitle] = useState(initialData?.title || "");
  const [questions, setQuestions] = useState(initialData?.questions || []);
  const [timer, setTimer] = useState(initialData?.timer || 30);
  useEffect(() => {
    if (initialData) {
      if (initialData.type === "test") {
        setNewTestTitle(initialData.title || "");
        setQuestions(initialData.questions || []);
        setTimer(initialData.timer || 30);
      } else {
        setNewTitle(initialData.title || "");
        setContents(initialData.contents || []);
      }
    }
  }, [initialData]);

  const handleAddContent = () => {
    setContents([...contents, { type: "text", value: "" }]);
  };

  const handleContentChange = (index, field, value) => {
    const updatedContents = [...contents];
    if (field === "value" && value instanceof File) {
      updatedContents[index][field] = value;
    } else {
      updatedContents[index][field] = value;
    }
    setContents(updatedContents);
  };

  const handleRemoveContent = (index) => {
    const updatedContents = contents.filter((_, i) => i !== index);
    setContents(updatedContents);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { 
      question: "", 
      options: ["", "", "", ""], 
      correctOption: 0 
    }]);
  };

  const handleUpdateQuestion = (index, field, value) => {
    const updatedQuestions = [...questions];
    if (field === "question") {
      updatedQuestions[index].question = value;
    } else if (field.startsWith("option")) {
      const optionIndex = parseInt(field.split("-")[1], 10);
      updatedQuestions[index].options[optionIndex] = value;
    } else if (field === "correctOption") {
      updatedQuestions[index].correctOption = parseInt(value, 10);
    }
    setQuestions(updatedQuestions);
  };

  const handleRemoveQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const getContentTypeIcon = (type) => {
    switch (type) {
      case "text": return <TextFields className="content-type-icon" />;
      case "video": return <VideoLibrary className="content-type-icon" />;
      case "youtube": return <YouTube className="content-type-icon" />;
      case "pdf": return <PictureAsPdf className="content-type-icon" />;
      case "image": return <Image className="content-type-icon" />;
      default: return <TextFields className="content-type-icon" />;
    }
  };
  const handleSubmitMicroCourse = async () => {
    if (!newTitle.trim()) {
      alert("Veuillez entrer un titre pour le micro-cours");
      return;
    }
    
    if (contents.length === 0) {
      alert("Veuillez ajouter au moins un contenu");
      return;
    }

    try {
      if (isEditing && initialData && initialData.type === "micro-course") {
        // For editing, pass the complete data including ID
        await handleAddMicroCourse({
          _id: initialData._id,
          title: newTitle,
          contents: contents,
          order: initialData.order || 0
        });
      } else {
        // For creating new micro-course
        await handleAddMicroCourse(newTitle, contents, insertIndex);
      }
      
      // Reset form only if not editing
      if (!isEditing) {
        setNewTitle("");
        setContents([]);
        setInsertIndex(null);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du micro-cours:", error);
    }
  };
  const handleSubmitTest = async () => {
    if (!newTestTitle.trim()) {
      alert("Veuillez entrer un titre pour le test");
      return;
    }
    
    if (questions.length === 0) {
      alert("Veuillez ajouter au moins une question");
      return;
    }

    try {
      if (isEditing && initialData && initialData.type === "test") {
        // For editing, pass the complete data including ID
        await handleAddTestAtPosition({
          _id: initialData._id,
          title: newTestTitle,
          questions: questions,
          timer: timer
        });
      } else {
        // For creating new test
        await handleAddTestAtPosition(newTestTitle, questions, timer);
      }
      
      // Reset form only if not editing
      if (!isEditing) {
        setNewTestTitle("");
        setQuestions([]);
        setTimer(30);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du test:", error);
    }
  };

  return (
    <Box className="formCreate" sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Section Micro-Cours */}
      <Paper className="form-section micro-course-section" elevation={4}>
        <Box className="section-header">
          <Box className="section-title-container">
            <LibraryBooks className="section-main-icon" />
            <Typography variant="h5" className="section-title">
              {initialData && initialData.type !== "test" ? "Modifier le Micro-Cours" : "Créer un Micro-Cours"}
            </Typography>
          </Box>
          <Chip 
            icon={<LibraryBooks />}
            label="Contenu Pédagogique"
            className="section-chip"
            variant="outlined"
          />
        </Box>
        
        <Divider className="modern-divider" />
        
        <Box className="form-content">
          {/* Titre du cours */}
          <Box className="input-group">
            <TextField
              fullWidth
              label="Titre du Micro-Cours"
              placeholder="Entrez un titre attractif pour votre micro-cours..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              variant="outlined"
              className="modern-input"
              InputProps={{
                startAdornment: <TextFields className="input-icon" />,
              }}
            />
          </Box>

          {/* Contenus */}
          <Box className="contents-section">
            <Box className="subsection-header">
              <Typography variant="h6" className="subsection-title">
                Contenus du Micro-Cours
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddCircleOutline />}
                onClick={handleAddContent}
                className="add-content-btn"
              >
                Ajouter un Contenu
              </Button>
            </Box>

            <Grid container spacing={3} className="contents-grid">
              {contents.map((content, index) => (
                <Grid item xs={12} key={index}>
                  <Card className="content-card" elevation={2}>
                    <CardContent>
                      <Box className="content-item-header">
                        <Box className="drag-handle">
                          <DragIndicator className="drag-icon" />
                          <Typography variant="subtitle2" color="primary">
                            Contenu #{index + 1}
                          </Typography>
                        </Box>
                        <Box className="content-actions">
                          <FormControl size="small" className="content-type-select">
                            <Select
                              value={content.type}
                              onChange={(e) => handleContentChange(index, "type", e.target.value)}
                              startAdornment={getContentTypeIcon(content.type)}
                            >
                              <MenuItem value="text">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <TextFields fontSize="small" />
                                  Texte
                                </Box>
                              </MenuItem>
                              <MenuItem value="youtube">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <YouTube fontSize="small" />
                                  YouTube
                                </Box>
                              </MenuItem>
                              <MenuItem value="video">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <VideoLibrary fontSize="small" />
                                  Vidéo
                                </Box>
                              </MenuItem>
                              <MenuItem value="image">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Image fontSize="small" />
                                  Image
                                </Box>
                              </MenuItem>
                              <MenuItem value="pdf">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <PictureAsPdf fontSize="small" />
                                  PDF
                                </Box>
                              </MenuItem>
                            </Select>
                          </FormControl>
                          <Tooltip title="Supprimer ce contenu">
                            <IconButton
                              color="error"
                              onClick={() => handleRemoveContent(index)}
                              className="delete-btn"
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>

                      <Box className="content-input-area">
                        {content.type === "text" || content.type === "youtube" ? (
                          <TextField
                            fullWidth
                            multiline={content.type === "text"}
                            rows={content.type === "text" ? 3 : 1}
                            placeholder={
                              content.type === "text" 
                                ? "Saisissez votre texte ici..." 
                                : "Collez l'URL YouTube ici..."
                            }
                            value={content.value}
                            onChange={(e) => handleContentChange(index, "value", e.target.value)}
                            variant="outlined"
                            className="content-input"
                          />
                        ) : (
                          <Box className="file-upload-zone">
                            <input
                              type="file"
                              accept={
                                content.type === "image" ? "image/*" :
                                content.type === "video" ? "video/*" :
                                content.type === "pdf" ? ".pdf" : "*/*"
                              }
                              onChange={(e) => handleContentChange(index, "value", e.target.files[0])}
                              style={{ display: 'none' }}
                              id={`file-input-${index}`}
                            />
                            <label htmlFor={`file-input-${index}`} className="file-upload-label">
                              <Box className="upload-content">
                                <CloudUpload className="upload-icon" />
                                <Typography variant="body1" className="upload-text">
                                  {content.value && content.value.name ? 
                                    content.value.name : 
                                    `Cliquez pour sélectionner un fichier ${content.type.toUpperCase()}`
                                  }
                                </Typography>
                                <Typography variant="caption" className="upload-hint">
                                  Glissez-déposez ou cliquez pour parcourir
                                </Typography>
                              </Box>
                            </label>
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box className="form-actions">
            <Button
              variant="contained"
              size="large"
              startIcon={<Save />}
              onClick={handleSubmitMicroCourse}
              className="submit-btn primary"
              disabled={!newTitle.trim() || contents.length === 0}
            >
              {initialData && initialData.type !== "test" ? "Mettre à jour le Micro-Cours" : "Créer le Micro-Cours"}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Section Test/Examen */}
      <Paper className="form-section test-section" elevation={4}>
        <Box className="section-header">
          <Box className="section-title-container">
            <Quiz className="section-main-icon" />
            <Typography variant="h5" className="section-title">
              {initialData && initialData.type === "test" ? "Modifier le Test" : "Créer un Test/Examen"}
            </Typography>
          </Box>
          <Chip 
            icon={<Quiz />}
            label="Évaluation"
            className="section-chip test-chip"
            variant="outlined"
          />
        </Box>
        
        <Divider className="modern-divider" />
        
        <Box className="form-content">
          {/* Configuration du test */}
          <Grid container spacing={3} className="test-config">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Titre du Test/Examen"
                placeholder="Entrez le titre de votre test..."
                value={newTestTitle}
                onChange={(e) => setNewTestTitle(e.target.value)}
                variant="outlined"
                className="modern-input"
                InputProps={{
                  startAdornment: <Quiz className="input-icon" />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Durée (minutes)"
                value={timer}
                onChange={(e) => setTimer(parseInt(e.target.value) || 0)}
                variant="outlined"
                className="modern-input"
                InputProps={{
                  startAdornment: <Timer className="input-icon" />,
                  inputProps: { min: 1, max: 180 }
                }}
              />
            </Grid>
          </Grid>

          {/* Questions */}
          <Box className="questions-section">
            <Box className="subsection-header">
              <Typography variant="h6" className="subsection-title">
                Questions du Test
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddCircleOutline />}
                onClick={handleAddQuestion}
                className="add-question-btn"
              >
                Ajouter une Question
              </Button>
            </Box>

            <Grid container spacing={3} className="questions-grid">
              {questions.map((question, qIndex) => (
                <Grid item xs={12} key={qIndex}>
                  <Card className="question-card" elevation={2}>
                    <CardContent>
                      <Box className="question-header">
                        <Box className="question-number">
                          <Chip
                            label={`Q${qIndex + 1}`}
                            color="primary"
                            variant="filled"
                            size="small"
                          />
                        </Box>
                        <Tooltip title="Supprimer cette question">
                          <IconButton
                            color="error"
                            onClick={() => handleRemoveQuestion(qIndex)}
                            className="delete-question-btn"
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>

                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        label="Question"
                        placeholder="Saisissez votre question ici..."
                        value={question.question}
                        onChange={(e) => handleUpdateQuestion(qIndex, "question", e.target.value)}
                        variant="outlined"
                        className="question-input"
                        sx={{ mb: 3 }}
                      />

                      <Typography variant="subtitle2" className="options-title">
                        Options de réponse :
                      </Typography>

                      <RadioGroup
                        value={question.correctOption}
                        onChange={(e) => handleUpdateQuestion(qIndex, "correctOption", e.target.value)}
                        className="options-group"
                      >
                        <Grid container spacing={2}>
                          {question.options.map((option, optIndex) => (
                            <Grid item xs={12} sm={6} key={optIndex}>
                              <Box className="option-item">
                                <FormControlLabel
                                  value={optIndex}
                                  control={<Radio color="primary" />}
                                  label=""
                                  className="option-radio"
                                />
                                <TextField
                                  fullWidth
                                  size="small"
                                  placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                                  value={option}
                                  onChange={(e) => handleUpdateQuestion(qIndex, `option-${optIndex}`, e.target.value)}
                                  variant="outlined"
                                  className={`option-input ${question.correctOption === optIndex ? 'correct-option' : ''}`}
                                />
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </RadioGroup>

                      <Box className="question-info">
                        <Chip
                          label={`Réponse correcte: ${String.fromCharCode(65 + question.correctOption)}`}
                          color="success"
                          variant="outlined"
                          size="small"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box className="form-actions">
            <Button
              variant="contained"
              size="large"
              startIcon={<Save />}
              onClick={handleSubmitTest}
              className="submit-btn secondary"
              disabled={!newTestTitle.trim() || questions.length === 0}
            >
              {initialData && initialData.type === "test" ? "Mettre à jour le Test" : "Créer le Test"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default FormCreate;
