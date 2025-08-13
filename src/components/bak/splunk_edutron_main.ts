import React, { useState, useEffect } from 'react';
import { ChevronLeft, Plus, ExternalLink, Users, BookOpen, Clock, DollarSign, Monitor, GraduationCap, Edit, Check, X, Save, Undo, Redo, PenTool } from 'lucide-react';
import Controls from './Controls';
import Courses from './Courses';
import Team from './Team';

// Silicon Valley cast member names
const CAST_NAMES = [
  'Richard Hendricks',
  'Erlich Bachman',
  'Dinesh Chugtai',
  'Bertram Gilfoyle',
  'Jared Dunn',
  'Monica Hall',
  'Gavin Belson',
  'Nelson Bighetti', // Big Head
  'Russ Hanneman',
  'Peter Gregory',
  'Laurie Bream',
  'Ed Chen',
  'Hoover Chan',
  'Don Bang',
  'Carla Walton',
  'Dan Melcher',
  'Fiona Wallace',
  'John Stafford',
  'Kara Swisher',
  'Maximo Reyes'
];

const loadCoursesFromCSV = async () => {
  try {
    const response = await fetch('/courses.csv');
    if (!response.ok) {
      throw new Error(`Failed to load courses.csv: ${response.status}`);
    }
    const text = await response.text();
    
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    const courses = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = line.split(',').map(v => v.trim());
      if (values.length < headers.length) continue;
      
      const course = {};
      headers.forEach((header, index) => {
        let value = values[index] || '';
        
        if (header === 'Duration' || header === 'Price') {
          value = parseFloat(value) || 0;
        } else if (header === 'STEP ID') {
          course['STEP_ID'] = value;
          return;
        }
        
        course[header] = value;
      });
      
      if (course.ID && course.Name) {
        courses.push(course);
      }
    }
    
    return courses;
  } catch (error) {
    console.error('Error loading courses:', error);
    return [];
  }
};

// Welcome Screen Component
const WelcomeScreen = ({ onCreatePlan, onLoadPlan }) => {
  useEffect(() => {
    document.title = "Splunk EDUTRON — Create, Manage, and Sell Splunk EDU Training Plans";
  }, []);

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: 'url(/img/luis-tosta-COAbFWdOf5s-unsplash.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="max-w-2xl mx-auto text-center relative z-10">
        <div className="bg-gradient-to-br from-blue-900/90 via-purple-800/90 to-blue-900/90 backdrop-blur-md rounded-3xl p-12 shadow-2xl border border-white/20">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
              Splunk <span className="text-orange-300">EDUTRON</span>
            </h1>
            <p className="text-lg text-white/90 font-light mb-2">
              <em>The Missing Splunk EDU Training Planner</em>
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <button 
              onClick={onCreatePlan}
              className="w-full bg-white text-gray-800 hover:bg-gray-50 font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-3"
            >
              <PenTool className="w-5 h-5" />
              Create Training Plan
            </button>
            
            <button 
              onClick={onLoadPlan}
              className="w-full bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-800 font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-3"
            >
              <ExternalLink className="w-5 h-5" />
              Load Existing Plan
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              <span>Interactive Planning</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Team Support</span>
            </div>
            <div className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              <span>STEP Integration</span>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
        v0.0.1 • By <a href="mailto:mohammba&#64;cisco&#46;com?Subject=Splunk%20EDUTRON" className="text-orange-300 hover:text-orange-200">Mo Badran</a> • <em>Boil 'em, mash 'em, stick 'em in a stew!</em>
      </footer>
    </div>
  );
};

// Plan Builder Component
const PlanBuilder = ({ onBackToWelcome, courses }) => {
  const [teamMembers, setTeamMembers] = useState([CAST_NAMES[0]]);
  const [selections, setSelections] = useState({});
  const [planTitle, setPlanTitle] = useState('Pied Piper / Splunk Training Plan');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    document.title = "Splunk EDUTRON — Create Training Plan";
    window.history.replaceState(null, '', '/#create');
  }, []);

  const saveState = () => {
    const state = {
      teamMembers: [...teamMembers],
      selections: {...selections},
      planTitle
    };
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(state);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setTeamMembers(prevState.teamMembers);
      setSelections(prevState.selections);
      setPlanTitle(prevState.planTitle);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setTeamMembers(nextState.teamMembers);
      setSelections(nextState.selections);
      setPlanTitle(nextState.planTitle);
      setHistoryIndex(historyIndex + 1);
    }
  };

  const handleAddTeamMember = () => {
    saveState();
    const newMemberName = CAST_NAMES[teamMembers.length] || `Team Member ${teamMembers.length + 1}`;
    setTeamMembers([...teamMembers, newMemberName]);
  };

  const handleUpdateTeamMember = (index, newName) => {
    saveState();
    const updatedMembers = [...teamMembers];
    updatedMembers[index] = newName;
    setTeamMembers(updatedMembers);
  };

  const handleToggleSelection = (courseIndex, memberIndex) => {
    saveState();
    const key = `${courseIndex}-${memberIndex}`;
    setSelections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleUpdateTitle = (newTitle) => {
    saveState();
    setPlanTitle(newTitle);
  };

  const isSelected = (courseIndex, memberIndex) => {
    const key = `${courseIndex}-${memberIndex}`;
    return selections[key] || false;
  };

  const getSelectedCount = () => {
    return Object.values(selections).filter(Boolean).length;
  };

  const handleSave = () => {
    alert('Save functionality coming soon! This will provide a download option.');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Controls
        onBackToWelcome={onBackToWelcome}
        planTitle={planTitle}
        onUpdateTitle={handleUpdateTitle}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onSave={handleSave}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        teamCount={teamMembers.length}
        courseCount={courses.length}
        selectedCount={getSelectedCount()}
      />

      <div className="flex-1 p-6 bg-gray-100 mt-6">
        <p className="text-gray-600 mb-4 italic">Click on the cells below to select courses for each team member.</p>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="flex max-h-[calc(100vh-300px)]">
            <Courses courses={courses} />
            <Team
              teamMembers={teamMembers}
              courses={courses}
              onAddTeamMember={handleAddTeamMember}
              onUpdateTeamMember={handleUpdateTeamMember}
              onToggleSelection={handleToggleSelection}
              isSelected={isSelected}
            />
          </div>
        </div>
      </div>

      <footer className="bg-white border-t border-gray-200 py-3 text-center text-gray-500 text-sm">
        v0.0.1
      </footer>
    </div>
  );
};

// Main App Component
const SplunkEdutron = () => {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreatePlan = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const loadedCourses = await loadCoursesFromCSV();
      if (loadedCourses.length === 0) {
        throw new Error('No courses found in courses.csv');
      }
      setCourses(loadedCourses);
      setCurrentScreen('create');
    } catch (err) {
      setError(`Failed to load courses: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToWelcome = () => {
    setCurrentScreen('welcome');
    setCourses([]);
    setError(null);
    window.history.replaceState(null, '', '/');
  };

  const handleLoadPlan = () => {
    alert('Load functionality coming soon!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-800 via-slate-700 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-800 via-slate-700 to-blue-900 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="text-red-400 mb-4">⚠️ Error</div>
            <p className="text-white mb-4">{error}</p>
            <p className="text-white/70 text-sm mb-6">
              Make sure courses.csv is in your /public directory
            </p>
            <button 
              onClick={handleBackToWelcome}
              className="bg-white text-gray-800 hover:bg-gray-50 font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
        <footer className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
          v0.0.1 • By <a href="mailto:mohammba&#64;cisco&#46;com?Subject=Splunk%20EDUTRON" className="text-orange-300 hover:text-orange-200">Mo Badran</a> • <em>Boil 'em, mash 'em, stick 'em in a stew!</em>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {currentScreen === 'welcome' && (
        <WelcomeScreen 
          onCreatePlan={handleCreatePlan}
          onLoadPlan={handleLoadPlan}
        />
      )}
      
      {currentScreen === 'create' && (
        <PlanBuilder 
          onBackToWelcome={handleBackToWelcome}
          courses={courses}
        />
      )}
    </div>
  );
};

export default SplunkEdutron;