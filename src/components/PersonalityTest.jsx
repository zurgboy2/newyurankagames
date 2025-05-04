import React, { useState } from 'react';
import './PersonalityTest.css';

const PersonalityTest = () => {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState('');

  const questions = [
    {
      question: "You're ambushed by bounty hunters. What do you do?",
      options: [
        { text: "Negotiate a way out.", ending: 1 },
        { text: "Draw your weapon and fight.", ending: 2 },
        { text: "Cry your eyes out.", ending: 3 }
      ]
    },
    {
      question: "Which Star Wars character do you resonate with the most?",
      options: [
        { text: "Luke Skywalker", ending: 1 },
        { text: "Darth Vader", ending: 2 },
        { text: "Yoda", ending: 1 },
        { text: "Emperor Palpatine", ending: 2 },
        { text: "Obi-Wan Kenobi", ending: 1 },
        { text: "Peter from Family Guy", ending: 3 }
      ]
    },
    {
      question: "How would you describe your personality in one word?",
      isTextField: true
    },
    {
      question: "In a conflict, what is your preferred approach?",
      options: [
        { text: "Negotiation", ending: 1 },
        { text: "Aggression", ending: 2 },
        { text: "Avoidance", ending: 2 },
        { text: "Adaptation", ending: 1 },
        { text: "Sulk", ending: 3 }
      ]
    },
    {
      question: "Which Star Wars movie is your favorite?",
      options: [
        { text: "A New Hope", ending: 1 },
        { text: "The Empire Strikes Back", ending: 2 },
        { text: "Return of the Jedi", ending: 1 },
        { text: "The Phantom Menace", ending: 2 },
        { text: "The Force Awakens", ending: 1 },
        { text: "Return of the Yoda", ending: 3 }
      ]
    },
    {
      question: "The galaxy is unfair. How do you respond?",
      options: [
        { text: "Work to bring peace and justice.", ending: 1 },
        { text: "Seize power to change things yourself.", ending: 2 },
        { text: "Kill Your self", ending: 3 }
      ]
    },
    {
      question: "What matters most to you?",
      options: [
        { text: "Wisdom and harmony.", ending: 1 },
        { text: "Strength and control.", ending: 2 },
        { text: "Wealth", ending: 3 }
      ]
    },
    {
      question: "A fellow traveller is in danger. You…",
      options: [
        { text: "Risk yourself to save them.", ending: 1 },
        { text: "Only help if it benefits you.", ending: 2 },
        { text: "Ignore", ending: 3 },
        { text: "Save them without doing anything", ending: 3 }
      ]
    },
    {
      question: "A friend betrays you. Do you…",
      options: [
        { text: "Forgive and try to understand why.", ending: 1 },
        { text: "Plot revenge.", ending: 2 },
        { text: "Kill their Family.", ending: 3 },
        { text: "Sleep with them.", ending: 3 }
      ]
    },
    {
      question: "What drives your actions the most?",
      options: [
        { text: "Peace and balance", ending: 1 },
        { text: "Passion and desire", ending: 2 },
        { text: "Logic and neutrality", ending: 2 },
        { text: "Justice, no matter the cost", ending: 1 },
        { text: "Power and control", ending: 2 },
        { text: "Compassion and selflessness", ending: 1 },
        { text: "Do nothing", ending: 3 },
        { text: "Women", ending: 3 },
        { text: "Money", ending: 3 }
      ]
    }
  ];

  const handleAnswer = (ending) => {
    const newAnswers = { ...answers, [currentQuestion]: ending };
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const handleTextAnswer = (e) => {
    e.preventDefault();
    const newAnswers = { ...answers, [currentQuestion]: 0 }; // Text answer doesn't affect result
    setAnswers(newAnswers);
    setCurrentQuestion(currentQuestion + 1);
  };

  const calculateResult = (allAnswers) => {
    // Count occurrences of each ending
    let counts = { 1: 0, 2: 0, 3: 0 };
    
    for (let question in allAnswers) {
      const ending = allAnswers[question];
      if (ending) {
        counts[ending]++;
      }
    }
    
    // Determine the most common ending
    let maxCount = 0;
    let resultEnding = 0;
    
    for (let ending in counts) {
      if (counts[ending] > maxCount) {
        maxCount = counts[ending];
        resultEnding = parseInt(ending);
      }
    }
    
    // Set result based on ending
    if (resultEnding === 1) {
      setResult('jedi');
    } else if (resultEnding === 2) {
      setResult('sith');
    } else {
      setResult('secret');
    }
    
    setCurrentScreen('result');
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return (
          <div className="welcome-screen">
            <h1>Let's test your Worth</h1>
            <p>Jedi or Sith Personality Test</p>
            <button className='personality-test-button' onClick={() => setCurrentScreen('questions')}>Start</button>
          </div>
        );
        
      case 'questions':
        const currentQ = questions[currentQuestion];
        return (
          <div className="question-screen">
            <h2>Question {currentQuestion + 1} of {questions.length}</h2>
            <h3>{currentQ.question}</h3>
            
            {currentQ.isTextField ? (
              <form onSubmit={handleTextAnswer}>
                <input
                  className='personality-test-input-field' 
                  type="text" 
                  placeholder="Type your answer..." 
                  required 
                />
                <button 
                className='personality-test-button'  
                type="submit">
                  Next</button>
              </form>
            ) : (
              <div className="options">
                {currentQ.options.map((option, index) => (
                  <button 
                    className='personality-test-button' 
                    key={index} 
                    onClick={() => handleAnswer(option.ending)}
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
        
      case 'result':
        return (
          <div className="result-screen">
            {result === 'jedi' && (
              <>
                <h1>A Jedi you are. May the Force Be with you!</h1>
                <p>Jedi all the way</p>
              </>
            )}
            
            {result === 'sith' && (
              <>
                <h1>Power, Control, Passion. The dark side suits you. Welcome Home Sith</h1>
                <p>HAHAHAHAHAHAHAHA!!!!!</p>
              </>
            )}
            
            {result === 'secret' && (
              <>
                <h1>Secret Ending: YOU ARE THE SCUM OF THE UNIVERSE</h1>
                <p>PLEASE DONT LIVE IN THIS WORLD ANYMORE</p>
              </>
            )}
            
            <button 
            className='personality-test-button' 
            onClick={() => {
              setCurrentScreen('welcome');
              setCurrentQuestion(0);
              setAnswers({});
              setResult('');
            }}>
              Take the test again
            </button>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="personality-test-container">
      {renderCurrentScreen()}
    </div>
  );
};

export default PersonalityTest;