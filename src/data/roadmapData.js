import { MarkerType } from "reactflow";

// Définir les types de nœuds et leurs styles
export const nodeTypes = {
  DEFAULT: "default",
  MAIN: "main",
  CATEGORY: "category",
  SUBCATEGORY: "subcategory",
  RECOMMENDATION: "recommendation",
  POSSIBILITY: "possibility",
  SKILL: "skill"
};

// Styles des nœuds selon leur type
export const nodeStyles = {
  [nodeTypes.DEFAULT]: {
    backgroundColor: "#f0f0f0",
    color: "#000",
    border: "1px solid #ddd",
    borderRadius: "3px",
    padding: "8px 12px",
    fontSize: "12px",
    width: "auto",
    textAlign: "center"
  },
  [nodeTypes.MAIN]: {
    backgroundColor: "#3B82F6",
    color: "#fff",
    borderRadius: "6px",
    padding: "10px 15px",
    fontSize: "16px",
    fontWeight: "bold",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    width: "auto",
    textAlign: "center"
  },
  [nodeTypes.CATEGORY]: {
    backgroundColor: "#f97316",
    color: "#fff",
    borderRadius: "6px",
    padding: "10px 15px",
    fontSize: "14px",
    fontWeight: "bold",
    width: "auto",
    textAlign: "center"
  },
  [nodeTypes.SUBCATEGORY]: {
    backgroundColor: "#84cc16",
    color: "#fff",
    borderRadius: "6px", 
    padding: "10px",
    fontSize: "13px",
    fontWeight: "bold",
    width: "auto",
    textAlign: "center"
  },
  [nodeTypes.RECOMMENDATION]: {
    backgroundColor: "#FFEB3B",
    color: "#000",
    border: "1px solid #FFC107",
    borderRadius: "3px",
    padding: "8px 10px",
    fontSize: "12px",
    width: "auto",
    textAlign: "center"
  },
  [nodeTypes.POSSIBILITY]: {
    backgroundColor: "#fff",
    color: "#000",
    border: "1px solid #ddd",
    borderRadius: "3px",
    padding: "8px 10px",
    fontSize: "12px",
    width: "auto",
    textAlign: "center"
  },
  [nodeTypes.SKILL]: {
    backgroundColor: "#e0f2fe",
    color: "#0369a1",
    border: "1px solid #7dd3fc",
    borderRadius: "3px",
    padding: "8px 10px",
    fontSize: "12px",
    width: "auto",
    textAlign: "center"
  }
};

// Fonction pour créer un nœud avec son type et style
export const createNode = (id, label, x, y, type = nodeTypes.DEFAULT, data = {}) => ({
  id,
  data: { 
    label,
    ...data 
  },
  position: { x, y },
  style: nodeStyles[type],
  type: "default"
});

// Fonction pour créer une connexion entre deux nœuds
export const createEdge = (source, target, animated = false, label = "", type = "smoothstep") => ({
  id: `e-${source}-${target}`,
  source,
  target,
  animated,
  label,
  type,
  style: { stroke: "#777", strokeWidth: 1.5 },
  labelStyle: { fontSize: "10px", fill: "#555" },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 15,
    height: 15,
    color: "#777",
  },
});

// Exemple de données pour une roadmap similaire à l'image ML Engineer
export const generateExampleMLEngineerData = () => {
  // Nœud principal
  const mainNode = createNode("ml-engineer", "ML Engineer", 500, 60, nodeTypes.MAIN);

  // Sections principales (3 niveaux d'apprentissage)
  const learnBasics = createNode("learn-basics", "Learn the Basics", 500, 160, nodeTypes.CATEGORY);
  const gettingDeeper = createNode("getting-deeper", "Getting Deeper", 500, 460, nodeTypes.CATEGORY);
  const maximizeSkills = createNode("maximize-skills", "Maximize Your Skills", 500, 760, nodeTypes.CATEGORY);

  // Sous-catégories pour "Learn the Basics"
  const programmingLanguage = createNode("programming-language", "Programming Language", 500, 260, nodeTypes.SUBCATEGORY);
  const cloudComputing = createNode("cloud-computing", "Cloud Computing", 800, 260, nodeTypes.SUBCATEGORY);
  const mlFrameworks = createNode("ml-frameworks", "ML Frameworks", 200, 260, nodeTypes.SUBCATEGORY);

  // Sous-catégories pour "Getting Deeper"
  const mlOps = createNode("mlops", "MLOps", 500, 560, nodeTypes.SUBCATEGORY);
  const experimentManagement = createNode("experiment-management", "Experiment Management", 200, 560, nodeTypes.SUBCATEGORY);
  const machineLearning1 = createNode("machine-learning-1", "Machine Learning #1", 800, 560, nodeTypes.SUBCATEGORY);

  // Sous-catégories pour "Maximize Skills"
  const mathematics = createNode("mathematics", "Mathematics", 300, 860, nodeTypes.SUBCATEGORY);
  const machineLearning2 = createNode("machine-learning-2", "Machine Learning #2", 700, 860, nodeTypes.SUBCATEGORY);

  // Languages de programmation
  const python = createNode("python", "Python", 400, 330, nodeTypes.RECOMMENDATION);
  const go = createNode("go", "Go", 500, 330, nodeTypes.POSSIBILITY);
  const cpp = createNode("cpp", "C/C++", 600, 330, nodeTypes.POSSIBILITY);
  const javascript = createNode("javascript", "JavaScript (Node.js)", 450, 330, nodeTypes.POSSIBILITY);
  const java = createNode("java", "Java", 550, 330, nodeTypes.POSSIBILITY);
  const typescript = createNode("typescript", "TypeScript", 650, 330, nodeTypes.POSSIBILITY);

  // ML Frameworks
  const tensorflow = createNode("tensorflow", "TensorFlow", 200, 330, nodeTypes.RECOMMENDATION);
  const pytorch = createNode("pytorch", "PyTorch", 200, 380, nodeTypes.RECOMMENDATION);
  const jax = createNode("jax", "JAX in-Time", 100, 330, nodeTypes.POSSIBILITY);
  const openCV = createNode("opencv", "OpenCV", 100, 380, nodeTypes.POSSIBILITY);

  // Cloud Computing
  const cloudArchitecture = createNode("serverless", "Serverless Architecture", 800, 330, nodeTypes.SUBCATEGORY);
  const kubernetes = createNode("kubernetes", "Kubernetes", 900, 330, nodeTypes.POSSIBILITY);
  const docker = createNode("docker", "Docker/Container Platform", 700, 330, nodeTypes.RECOMMENDATION);

  // MLOps
  const modelServing = createNode("model-serving", "Model Serving", 500, 630, nodeTypes.RECOMMENDATION);
  const modelTraining = createNode("model-training", "Model Training", 400, 630, nodeTypes.RECOMMENDATION);
  const modelDeployment = createNode("model-deployment", "Model Deployment", 600, 630, nodeTypes.RECOMMENDATION);
  const modelValidation = createNode("model-validation", "Model Validation", 500, 680, nodeTypes.RECOMMENDATION);

  // Mathematics
  const linearAlgebra = createNode("linear-algebra", "Linear Algebra", 200, 930, nodeTypes.RECOMMENDATION);
  const probability = createNode("probability", "Probability & Stats", 300, 930, nodeTypes.RECOMMENDATION);
  const optimization = createNode("optimization", "Optimization Theory", 400, 930, nodeTypes.RECOMMENDATION);

  // Machine Learning avancé
  const supervisedLearning = createNode("supervised-learning", "Supervised Learning", 700, 930, nodeTypes.RECOMMENDATION);
  const unsupervisedLearning = createNode("unsupervised-learning", "Unsupervised Learning", 700, 980, nodeTypes.RECOMMENDATION);
  const reinforcementLearning = createNode("reinforcement-learning", "Reinforcement Learning", 800, 930, nodeTypes.RECOMMENDATION);
  const clustering = createNode("clustering", "Clustering", 800, 980, nodeTypes.POSSIBILITY);

  // Créer les connexions
  const edges = [
    createEdge("ml-engineer", "learn-basics"),
    createEdge("learn-basics", "getting-deeper"),
    createEdge("getting-deeper", "maximize-skills"),
    createEdge("learn-basics", "programming-language"),
    createEdge("learn-basics", "cloud-computing"),
    createEdge("learn-basics", "ml-frameworks"),
    createEdge("getting-deeper", "mlops"),
    createEdge("getting-deeper", "experiment-management"),
    createEdge("getting-deeper", "machine-learning-1"),
    createEdge("maximize-skills", "mathematics"),
    createEdge("maximize-skills", "machine-learning-2"),
    createEdge("programming-language", "python"),
    createEdge("programming-language", "go"),
    createEdge("programming-language", "cpp"),
    createEdge("programming-language", "javascript"),
    createEdge("programming-language", "java"),
    createEdge("programming-language", "typescript"),
    createEdge("ml-frameworks", "tensorflow"),
    createEdge("ml-frameworks", "pytorch"),
    createEdge("ml-frameworks", "jax"),
    createEdge("ml-frameworks", "opencv"),
    createEdge("cloud-computing", "serverless"),
    createEdge("cloud-computing", "kubernetes"),
    createEdge("cloud-computing", "docker"),
    createEdge("mlops", "model-serving"),
    createEdge("mlops", "model-training"),
    createEdge("mlops", "model-deployment"),
    createEdge("mlops", "model-validation"),
    createEdge("mathematics", "linear-algebra"),
    createEdge("mathematics", "probability"),
    createEdge("mathematics", "optimization"),
    createEdge("machine-learning-2", "supervised-learning"),
    createEdge("machine-learning-2", "unsupervised-learning"),
    createEdge("machine-learning-2", "reinforcement-learning"),
    createEdge("machine-learning-2", "clustering"),
  ];

  // Tous les nœuds
  const nodes = [
    mainNode,
    learnBasics, gettingDeeper, maximizeSkills,
    programmingLanguage, cloudComputing, mlFrameworks,
    mlOps, experimentManagement, machineLearning1,
    mathematics, machineLearning2,
    python, go, cpp, javascript, java, typescript,
    tensorflow, pytorch, jax, openCV,
    cloudArchitecture, kubernetes, docker,
    modelServing, modelTraining, modelDeployment, modelValidation,
    linearAlgebra, probability, optimization,
    supervisedLearning, unsupervisedLearning, reinforcementLearning, clustering
  ];

  return { nodes, edges };
};
