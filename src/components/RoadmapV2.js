import React, { useState, useEffect } from 'react';

// Test response data
const testResponse = {
  "success": true,
  "roadmap": {
    "id": "java",
    "title": "Java Programming Roadmap",
    "description": "Comprehensive guide to becoming proficient in Java programming, from basics to advanced concepts.",
    "icon": "java",
    "color": "#f89820",
    "difficulty": "Intermediate",
    "estimatedHours": 120,
    "createdAt": "2025-04-14T20:15:01.492Z",
    "updatedAt": "2025-04-14T20:15:01.492Z",
    "visualData": {
      "title": "Java Programming Roadmap",
      "type": "mindmap",
      "rootNode": "root",
      "nodes": [
        {
          "id": "root",
          "title": "Java Programming Roadmap",
          "type": "root",
          "x": 400,
          "y": 300
        },
        {
          "id": "java-basics",
          "title": "Java Basics",
          "type": "main",
          "x": 600,
          "y": 300
        },
        {
          "id": "oop-concepts",
          "title": "Object-Oriented Programming",
          "type": "main",
          "x": 561.8033988749895,
          "y": 417.55705045849464
        },
        {
          "id": "exception-handling",
          "title": "Exception Handling",
          "type": "main",
          "x": 461.8033988749895,
          "y": 490.21130325903073
        },
        {
          "id": "collections-framework",
          "title": "Collections Framework",
          "type": "main",
          "x": 338.19660112501055,
          "y": 490.21130325903073
        },
        {
          "id": "io-streams",
          "title": "I/O and Streams",
          "type": "main",
          "x": 238.19660112501055,
          "y": 417.55705045849464
        },
        {
          "id": "multithreading",
          "title": "Multithreading",
          "type": "main",
          "x": 200,
          "y": 300
        },
        {
          "id": "jdbc",
          "title": "JDBC",
          "type": "main",
          "x": 238.19660112501052,
          "y": 182.4429495415054
        },
        {
          "id": "java-gui",
          "title": "GUI Development",
          "type": "main",
          "x": 338.1966011250105,
          "y": 109.7886967409693
        },
        {
          "id": "networking",
          "title": "Networking",
          "type": "main",
          "x": 461.80339887498945,
          "y": 109.78869674096927
        },
        {
          "id": "advanced-java",
          "title": "Advanced Java",
          "type": "main",
          "x": 561.8033988749894,
          "y": 182.44294954150533
        }
      ],
      "connections": [
        {
          "source": "root",
          "target": "java-basics",
          "sourceType": "root",
          "targetType": "main"
        },
        {
          "source": "root",
          "target": "oop-concepts",
          "sourceType": "root",
          "targetType": "main"
        },
        {
          "source": "root",
          "target": "exception-handling",
          "sourceType": "root",
          "targetType": "main"
        },
        {
          "source": "root",
          "target": "collections-framework",
          "sourceType": "root",
          "targetType": "main"
        },
        {
          "source": "root",
          "target": "io-streams",
          "sourceType": "root",
          "targetType": "main"
        },
        {
          "source": "root",
          "target": "multithreading",
          "sourceType": "root",
          "targetType": "main"
        },
        {
          "source": "root",
          "target": "jdbc",
          "sourceType": "root",
          "targetType": "main"
        },
        {
          "source": "root",
          "target": "java-gui",
          "sourceType": "root",
          "targetType": "main"
        },
        {
          "source": "root",
          "target": "networking",
          "sourceType": "root",
          "targetType": "main"
        },
        {
          "source": "root",
          "target": "advanced-java",
          "sourceType": "root",
          "targetType": "main"
        },
        {
          "source": "java-basics",
          "target": "oop-concepts",
          "sourceType": "dependency",
          "targetType": "dependent",
          "isDependency": true
        },
        {
          "source": "java-basics",
          "target": "exception-handling",
          "sourceType": "dependency",
          "targetType": "dependent",
          "isDependency": true
        },
        {
          "source": "oop-concepts",
          "target": "collections-framework",
          "sourceType": "dependency",
          "targetType": "dependent",
          "isDependency": true
        },
        {
          "source": "exception-handling",
          "target": "io-streams",
          "sourceType": "dependency",
          "targetType": "dependent",
          "isDependency": true
        },
        {
          "source": "exception-handling",
          "target": "multithreading",
          "sourceType": "dependency",
          "targetType": "dependent",
          "isDependency": true
        },
        {
          "source": "collections-framework",
          "target": "jdbc",
          "sourceType": "dependency",
          "targetType": "dependent",
          "isDependency": true
        },
        {
          "source": "io-streams",
          "target": "jdbc",
          "sourceType": "dependency",
          "targetType": "dependent",
          "isDependency": true
        },
        {
          "source": "oop-concepts",
          "target": "java-gui",
          "sourceType": "dependency",
          "targetType": "dependent",
          "isDependency": true
        },
        {
          "source": "io-streams",
          "target": "networking",
          "sourceType": "dependency",
          "targetType": "dependent",
          "isDependency": true
        },
        {
          "source": "multithreading",
          "target": "advanced-java",
          "sourceType": "dependency",
          "targetType": "dependent",
          "isDependency": true
        },
        {
          "source": "collections-framework",
          "target": "advanced-java",
          "sourceType": "dependency",
          "targetType": "dependent",
          "isDependency": true
        },
        {
          "source": "jdbc",
          "target": "advanced-java",
          "sourceType": "dependency",
          "targetType": "dependent",
          "isDependency": true
        }
      ],
      "theme": {
        "backgroundColor": "#ffffff",
        "centerNodeColor": "#f0db4f",
        "primaryColor": "#61dafb",
        "secondaryColor": "#b8e0f9",
        "accentColor": "#a7c7e7",
        "textColor": "#333333"
      },
      "createdAt": "2025-04-14T20:15:01.494Z",
      "updatedAt": "2025-04-14T20:15:01.494Z"
    },
    "topics": [
      {
        "id": "advanced-java",
        "title": "Advanced Java",
        "description": "Advanced concepts and features in Java",
        "content": "# Advanced Java Concepts\n\nMastering these advanced concepts will make you a proficient Java developer.\n\n## Key Concepts\n\n- Java 8+ features (Lambda expressions, Stream API, Optional)\n- Reflection API\n- Annotation processing\n- Java Native Interface (JNI)\n- Memory management and garbage collection\n- Design patterns in Java\n- Testing frameworks (JUnit, Mockito)",
        "order": 10,
        "dependencies": [
          "multithreading",
          "collections-framework",
          "jdbc"
        ],
        "resources": [
          {
            "title": "Java 8 Features",
            "url": "https://www.oracle.com/java/technologies/javase/8-whats-new.html",
            "type": "documentation"
          },
          {
            "title": "Design Patterns in Java",
            "url": "https://refactoring.guru/design-patterns/java",
            "type": "tutorial"
          }
        ],
        "subtopics": [],
        "createdAt": "2025-04-14T20:15:01.492Z",
        "updatedAt": "2025-04-14T20:15:01.492Z"
      },
      {
        "id": "collections-framework",
        "title": "Collections Framework",
        "description": "Working with data collections in Java",
        "content": "# Java Collections Framework\n\nThe Java Collections Framework provides a set of interfaces and classes to store and manipulate groups of data as a single unit.\n\n## Key Concepts\n\n- Lists (ArrayList, LinkedList)\n- Sets (HashSet, TreeSet)\n- Maps (HashMap, TreeMap)\n- Queues and Deques\n- Iterator and Comparator interfaces",
        "order": 4,
        "dependencies": [
          "oop-concepts"
        ],
        "resources": [
          {
            "title": "Java Collections Tutorial",
            "url": "https://docs.oracle.com/javase/tutorial/collections/",
            "type": "documentation"
          }
        ],
        "subtopics": [],
        "createdAt": "2025-04-14T20:15:01.492Z",
        "updatedAt": "2025-04-14T20:15:01.492Z"
      },
      {
        "id": "exception-handling",
        "title": "Exception Handling",
        "description": "Managing errors and exceptions in Java",
        "content": "# Exception Handling in Java\n\nException handling is a mechanism to handle runtime errors.\n\n## Key Concepts\n\n- try-catch blocks\n- finally clause\n- throw and throws keywords\n- Custom exceptions\n- Exception hierarchy",
        "order": 3,
        "dependencies": [
          "java-basics"
        ],
        "resources": [
          {
            "title": "Java Exception Handling",
            "url": "https://www.geeksforgeeks.org/exceptions-in-java/",
            "type": "article"
          }
        ],
        "subtopics": [],
        "createdAt": "2025-04-14T20:15:01.492Z",
        "updatedAt": "2025-04-14T20:15:01.492Z"
      },
      {
        "id": "io-streams",
        "title": "I/O and Streams",
        "description": "Input/Output operations in Java",
        "content": "# Java I/O and Streams\n\nJava I/O (Input and Output) is used to process the input and produce the output.\n\n## Key Concepts\n\n- File handling\n- Byte streams\n- Character streams\n- Buffered streams\n- Standard streams (System.in, System.out, System.err)\n- Scanner class",
        "order": 5,
        "dependencies": [
          "exception-handling"
        ],
        "resources": [
          {
            "title": "Java I/O Tutorial",
            "url": "https://www.tutorialspoint.com/java/java_files_io.htm",
            "type": "tutorial"
          }
        ],
        "subtopics": [],
        "createdAt": "2025-04-14T20:15:01.492Z",
        "updatedAt": "2025-04-14T20:15:01.492Z"
      },
      {
        "id": "java-basics",
        "title": "Java Basics",
        "description": "Fundamentals of Java programming language",
        "content": "# Java Basics\n\nJava is a general-purpose programming language that is class-based, object-oriented, and designed to have as few implementation dependencies as possible.\n\n## Key Concepts\n\n- JDK, JRE, and JVM\n- Setting up Java environment\n- Java syntax fundamentals\n- Variables and data types\n- Operators\n- Control flow statements (if-else, switch, loops)\n- Methods and method overloading",
        "order": 1,
        "dependencies": [],
        "resources": [
          {
            "title": "Oracle Java Tutorials",
            "url": "https://docs.oracle.com/javase/tutorial/",
            "type": "documentation"
          },
          {
            "title": "W3Schools Java Tutorial",
            "url": "https://www.w3schools.com/java/",
            "type": "tutorial"
          }
        ],
        "subtopics": [],
        "createdAt": "2025-04-14T20:15:01.492Z",
        "updatedAt": "2025-04-14T20:15:01.492Z"
      },
      {
        "id": "java-gui",
        "title": "GUI Development",
        "description": "Creating graphical user interfaces in Java",
        "content": "# Java GUI Development\n\nJava provides several options for creating graphical user interfaces.\n\n## Key Concepts\n\n- AWT and Swing\n- JavaFX\n- Layout managers\n- Event handling\n- Components and containers",
        "order": 8,
        "dependencies": [
          "oop-concepts"
        ],
        "resources": [
          {
            "title": "Java Swing Tutorial",
            "url": "https://www.javatpoint.com/java-swing",
            "type": "tutorial"
          },
          {
            "title": "JavaFX Tutorial",
            "url": "https://openjfx.io/openjfx-docs/",
            "type": "documentation"
          }
        ],
        "subtopics": [],
        "createdAt": "2025-04-14T20:15:01.492Z",
        "updatedAt": "2025-04-14T20:15:01.492Z"
      },
      {
        "id": "jdbc",
        "title": "JDBC",
        "description": "Database connectivity in Java",
        "content": "# Java Database Connectivity (JDBC)\n\nJDBC provides a standard API for connecting Java applications to relational databases.\n\n## Key Concepts\n\n- JDBC drivers\n- Establishing database connections\n- SQL statements\n- PreparedStatement and CallableStatement\n- ResultSet\n- Transactions\n- Connection pooling",
        "order": 7,
        "dependencies": [
          "collections-framework",
          "io-streams"
        ],
        "resources": [
          {
            "title": "JDBC Tutorial",
            "url": "https://www.oracle.com/java/technologies/javase/javase-technical-resources.html",
            "type": "documentation"
          }
        ],
        "subtopics": [],
        "createdAt": "2025-04-14T20:15:01.492Z",
        "updatedAt": "2025-04-14T20:15:01.492Z"
      },
      {
        "id": "multithreading",
        "title": "Multithreading",
        "description": "Concurrent programming in Java",
        "content": "# Java Multithreading\n\nMultithreading is a process of executing multiple threads simultaneously.\n\n## Key Concepts\n\n- Creating and using threads\n- Thread lifecycle\n- Thread synchronization\n- wait(), notify(), and notifyAll()\n- Thread pools\n- Executor framework\n- Concurrent collections",
        "order": 6,
        "dependencies": [
          "exception-handling"
        ],
        "resources": [
          {
            "title": "Java Multithreading Tutorial",
            "url": "https://www.javatpoint.com/multithreading-in-java",
            "type": "tutorial"
          }
        ],
        "subtopics": [],
        "createdAt": "2025-04-14T20:15:01.492Z",
        "updatedAt": "2025-04-14T20:15:01.492Z"
      },
      {
        "id": "networking",
        "title": "Networking",
        "description": "Network programming in Java",
        "content": "# Java Networking\n\nJava provides excellent support for network programming.\n\n## Key Concepts\n\n- Socket programming\n- URL processing\n- TCP/IP and UDP\n- HTTP client\n- Network interfaces",
        "order": 9,
        "dependencies": [
          "io-streams"
        ],
        "resources": [
          {
            "title": "Java Networking Tutorial",
            "url": "https://docs.oracle.com/javase/tutorial/networking/",
            "type": "documentation"
          }
        ],
        "subtopics": [],
        "createdAt": "2025-04-14T20:15:01.492Z",
        "updatedAt": "2025-04-14T20:15:01.492Z"
      },
      {
        "id": "oop-concepts",
        "title": "Object-Oriented Programming",
        "description": "Understanding OOP principles in Java",
        "content": "# Object-Oriented Programming in Java\n\nJava is fully object-oriented and understanding these concepts is essential.\n\n## Key Concepts\n\n- Classes and Objects\n- Constructors\n- Inheritance\n- Polymorphism\n- Encapsulation\n- Abstraction\n- Interfaces and abstract classes",
        "order": 2,
        "dependencies": [
          "java-basics"
        ],
        "resources": [
          {
            "title": "Java OOP Concepts",
            "url": "https://www.javatpoint.com/java-oops-concepts",
            "type": "article"
          }
        ],
        "subtopics": [],
        "createdAt": "2025-04-14T20:15:01.492Z",
        "updatedAt": "2025-04-14T20:15:01.492Z"
      }
    ]
  }
};

// Main component
const App = () => {
  // Immediate use of test data without simulating API call
  const [roadmapData, setRoadmapData] = useState(testResponse.roadmap);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const getNodeColor = (type) => {
    const colors = {
      root: 'bg-yellow-400',
      main: 'bg-blue-400',
      dependency: 'bg-green-400',
      dependent: 'bg-purple-400'
    };
    return colors[type] || 'bg-gray-400';
  };

  const renderNodes = () => {
    if (!roadmapData?.visualData?.nodes) return null;
    
    return roadmapData.visualData.nodes.map(node => (
      <div 
        key={node.id}
        className={`absolute ${getNodeColor(node.type)} p-3 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-all z-20`}
        style={{ 
          left: `${node.x}px`, 
          top: `${node.y}px`,
          transform: 'translate(-50%, -50%)',
          minWidth: '120px'
        }}
        onClick={() => setSelectedTopic(roadmapData.topics.find(t => t.id === node.id))}
      >
        <div className="font-semibold text-center">{node.title}</div>
        {node.type === 'root' && (
          <div className="text-xs text-center mt-1">{roadmapData.difficulty} • {roadmapData.estimatedHours}h</div>
        )}
      </div>
    ));
  };

  const renderConnections = () => {
    if (!roadmapData?.visualData?.connections) return null;
    
    return roadmapData.visualData.connections.map((conn, index) => {
      const sourceNode = roadmapData.visualData.nodes.find(n => n.id === conn.source);
      const targetNode = roadmapData.visualData.nodes.find(n => n.id === conn.target);
      
      if (!sourceNode || !targetNode) return null;
      
      // Simple straight line connections
      return (
        <line
          key={index}
          x1={sourceNode.x}
          y1={sourceNode.y}
          x2={targetNode.x}
          y2={targetNode.y}
          stroke={conn.sourceType === 'root' ? '#f0db4f' : '#61dafb'}
          strokeWidth={conn.sourceType === 'root' ? 3 : 2}
        />
      );
    });
  };

  const renderTopicDetails = () => {
    if (!selectedTopic) return null;
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md mx-auto mt-8">
        <h3 className="text-2xl font-bold mb-4">{selectedTopic.title}</h3>
        <p className="text-gray-600 mb-4">{selectedTopic.description}</p>
        
        {selectedTopic.content && (
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Content:</h4>
            <div className="prose max-w-none bg-gray-50 p-4 rounded">
              {selectedTopic.content.split('\n').map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          </div>
        )}
        
        {selectedTopic.dependencies?.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold">Prerequisites:</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedTopic.dependencies.map(depId => {
                const depTopic = roadmapData.topics.find(t => t.id === depId);
                return depTopic ? (
                  <span 
                    key={depId}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm cursor-pointer"
                    onClick={() => setSelectedTopic(depTopic)}
                  >
                    {depTopic.title}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        )}
        
        {selectedTopic.resources?.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold">Resources:</h4>
            <ul className="mt-2 space-y-2">
              {selectedTopic.resources.map((resource, idx) => (
                <li key={idx} className="flex items-center">
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-2">
                    {resource.type}
                  </span>
                  <span className="text-blue-600">
                    {resource.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <button 
          onClick={() => setSelectedTopic(null)}
          className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8 bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-blue-700">{roadmapData.title}</h1>
          <p className="text-gray-600 mt-2">{roadmapData.description}</p>
          <div className="mt-4 flex justify-center space-x-4">
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
              {roadmapData.difficulty}
            </span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              {roadmapData.estimatedHours} hours
            </span>
          </div>
        </header>

        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="bg-gray-50 p-4 border-b">
            <h2 className="text-xl font-bold">Learning Path</h2>
            <p className="text-sm text-gray-600">Click on any topic to view details</p>
          </div>
          
          <div className="overflow-auto p-4">
            <div 
              className="relative mx-auto" 
              style={{ 
                width: '800px', 
                height: '600px',
                backgroundColor: roadmapData.visualData.theme.backgroundColor
              }}
            >
              <svg className="absolute top-0 left-0 w-full h-full">
                {renderConnections()}
              </svg>
              
              {renderNodes()}
            </div>
          </div>
        </div>

        {renderTopicDetails()}
      </div>
    </div>
  );
};

export default App;