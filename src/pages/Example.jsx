import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Heart, Star, ThumbsUp, MessageSquare } from 'lucide-react';
import Modal from '../components/Modal';
import ThemeToggle from '../components/ThemeToggle';

const Example = () => {
  const [likeCount, setLikeCount] = useState(42);
  const [starCount, setStarCount] = useState(128);
  const [feedbackModal, setFeedbackModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const handleLike = () => {
    setLikeCount(prev => prev + 1);
    toast.success('Thanks for the like!');
  };

  const handleStar = () => {
    setStarCount(prev => prev + 1);
    toast('⭐ Starred!');
  };

  const handleCardClick = (cardTitle) => {
    setSelectedCard(cardTitle);
    setFeedbackModal(true);
  };

  const exampleCards = [
    {
      title: 'Component Library',
      description: 'Reusable UI components built with Tailwind CSS and proper theming support.',
      icon: Heart,
      color: 'text-sidebar-active'
    },
    {
      title: 'Theme System',
      description: 'CSS variables-based theming that allows easy customization across the entire application.',
      icon: Star,
      color: 'text-yellow-500'
    },
    {
      title: 'Responsive Design',
      description: 'Mobile-first approach with responsive layouts that work across all device sizes.',
      icon: ThumbsUp,
      color: 'text-green-500'
    },
    {
      title: 'Modern Stack',
      description: 'Built with React 19, Vite, and the latest web development best practices.',
      icon: MessageSquare,
      color: 'text-blue-500'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-0">
      {/* Header with theme toggle */}
      <div className="flex justify-between items-start mb-6 sm:mb-8">
        <div className="flex-1 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">Example Page</h1>
          <p className="text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6 px-2">
            Demonstrating various components and interactions in action.
          </p>
        </div>
        <div className="ml-4 mt-2 hidden sm:block">
          <ThemeToggle />
        </div>
      </div>
        
      <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <button
          onClick={handleLike}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-background border border-border rounded-lg hover:bg-muted transition-colors text-sm sm:text-base"
        >
          <Heart className="w-4 h-4 text-sidebar-active" />
          <span>{likeCount} Likes</span>
        </button>
        <button
          onClick={handleStar}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-background border border-border rounded-lg hover:bg-muted transition-colors text-sm sm:text-base"
        >
          <Star className="w-4 h-4 text-yellow-500" />
          <span>{starCount} Stars</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {exampleCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div
              key={index}
              onClick={() => handleCardClick(card.title)}
              className="bg-background border border-border rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-all cursor-pointer hover:scale-105 fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className={`p-2 rounded-lg bg-muted ${card.color}`}>
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">{card.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">{card.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-background border border-border rounded-lg p-4 sm:p-6 shadow-sm">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Interactive Demo</h2>
        <p className="text-sm sm:text-base text-muted-foreground mb-4">
          This section demonstrates various interactive elements and state management.
        </p>
        
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
            <button
              onClick={() => toast.success('Success toast!')}
              className="px-4 py-2 bg-success text-success-foreground rounded-lg hover:opacity-90 transition-opacity text-sm sm:text-base"
            >
              Success Toast
            </button>
            <button
              onClick={() => toast.error('Error toast!')}
              className="px-4 py-2 bg-error text-error-foreground rounded-lg hover:opacity-90 transition-opacity text-sm sm:text-base"
            >
              Error Toast
            </button>
            <button
              onClick={() => toast('Info toast!')}
              className="px-4 py-2 bg-info text-info-foreground rounded-lg hover:opacity-90 transition-opacity text-sm sm:text-base"
            >
              Info Toast
            </button>
            <button
              onClick={() => toast.loading('Loading toast!')}
              className="px-4 py-2 bg-warning text-warning-foreground rounded-lg hover:opacity-90 transition-opacity text-sm sm:text-base"
            >
              Warning Toast
            </button>
            <div className="sm:hidden w-full mt-2">
              <ThemeToggle className="w-full justify-center" />
            </div>
          </div>
          
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              💡 Tip: Try clicking on the cards above to open detailed modals, or use the buttons to test different toast notifications.
            </p>
          </div>
        </div>
      </div>

      <Modal
        open={feedbackModal}
        onBackdropClick={() => setFeedbackModal(false)}
        title={`Details: ${selectedCard}`}
        size="lg"
        footer={
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={() => {
                toast.success('Feedback submitted!');
                setFeedbackModal(false);
              }}
              className="w-full sm:w-auto px-4 py-2 bg-sidebar-active text-white rounded-lg hover:bg-sidebar-hover transition-colors text-sm sm:text-base"
            >
              Submit Feedback
            </button>
            <button
              onClick={() => setFeedbackModal(false)}
              className="w-full sm:w-auto px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-border transition-colors text-sm sm:text-base"
            >
              Cancel
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-muted-foreground">
            You clicked on <strong>{selectedCard}</strong>. This modal demonstrates:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Dynamic content based on user interaction</li>
            <li>Multiple action buttons in the footer</li>
            <li>Proper state management between components</li>
            <li>Consistent theming across modal elements</li>
          </ul>
          
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Technical Details:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Built with React functional components and hooks</li>
              <li>• Styled with Tailwind CSS and CSS variables</li>
              <li>• Fully responsive and accessible</li>
              <li>• Smooth animations and transitions</li>
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Example;