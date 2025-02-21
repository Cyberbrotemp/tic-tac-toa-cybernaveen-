import React from 'react';
import { Github, Instagram, Send } from 'lucide-react';

const developers = [
  {
    name: 'Cybernaveen',
    role: 'Python Developer & cyber security learner and python script writter and basic frontend developer',
    image: 'https://media.licdn.com/dms/image/v2/C4D03AQGqUl231d6gJQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1660921925294?e=2147483647&v=beta&t=NLM96HjTEHrpk2ArgaivuI3xqRqpFa51Q3depnqvRoI',
    social: {
      github: 'https://github.com/naveenhacking',
      instagram: 'https://instagram.com/kutty_rolex_naveen',
      telegram: 'https://t.me/rolex_naveenk'
    }
  }
];

const Developers = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Meet Our Team</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {developers.map((dev) => (
          <div key={dev.name} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative">
              <img
                src={dev.image}
                alt={dev.name}
                className="w-full h-64 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <h2 className="text-2xl font-bold text-white">{dev.name}</h2>
                <p className="text-white/90">{dev.role}</p>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-center space-x-6">
                <a
                  href={dev.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Github className="h-6 w-6" />
                </a>
                <a
                  href={dev.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-pink-600 transition-colors"
                >
                  <Instagram className="h-6 w-6" />
                </a>
                <a
                  href={dev.social.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-500 transition-colors"
                >
                  <Send className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Developers;