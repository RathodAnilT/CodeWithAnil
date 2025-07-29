import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CSFundamentals = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [popupVideo, setPopupVideo] = useState(null);
  const [popupContent, setPopupContent] = useState(null);

  // Define CS topics with resources
  const topics = [
    {
      id: 1,
      title: 'Operating Systems',
      description: 'Process management, memory management, file systems, and more.',
      icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      category: 'core',
      resources: [
       
        { name: 'OS Notes - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/operating-systems/', type: 'link' },
        { name: 'MIT OpenCourseWare - OS', url: 'https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-828-operating-system-engineering-fall-2012/', type: 'link' },
        { name: 'Gate Smashers OS Playlist', url: 'https://youtube.com/playlist?list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p&si=Ezhh0b7QTUsihnRb', type: 'video' },
        { name: 'Love Babbar OS Playlist', url: 'https://youtube.com/playlist?list=PLDzeHZWIZsTr3nwuTegHLa2qlI81QweYG&si=uqzHlBDUIrOMKWjn', type: 'video' },
        { name: 'GeeksforGeeks OS Resources', url: 'https://www.geeksforgeeks.org/operating-systems/', type: 'link' },
        { name: 'Interviewbit Interview Q&A', url: 'https://www.interviewbit.com/operating-system-interview-questions/', type: 'link' }
      ]
    },
    {
      id: 2,
      title: 'Database Systems',
      description: 'RDBMS, SQL, normalization, transaction management, and NoSQL databases.',
      icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4',
      category: 'core',
      resources: [
        { name: 'Database System Concepts', url: 'https://www.amazon.com/Database-System-Concepts-Abraham-Silberschatz/dp/0073523321', type: 'link' },
        { name: 'SQL Tutorial - W3Schools', url: 'https://www.w3schools.com/sql/', type: 'link' },
        { name: 'MongoDB tutorial GeeksforGeeks', url: 'https://www.geeksforgeeks.org/mongodb-tutorial/', type: 'link' },
        { name: 'GeeksforGeeks DBMS Resources', url: 'https://www.geeksforgeeks.org/dbms/', type: 'link' },
        { name: 'Love Babbar DBMS Playlist', url: 'https://youtube.com/playlist?list=PLDzeHZWIZsTpukecmA2p5rhHM14bl2dHU&si=MDhvgSbmPk3XqDAV', type: 'video' },
        { name: 'Gate Smashers DBMS Playlist', url: 'https://youtube.com/playlist?list=PLxCzCOWd7aiFAN6I8CuViBuCdJgiOkT2Y&si=4uBMyJFTnRFKVj1y', type: 'video' },
        { name: 'Rishabh Mishra SQL Playlist', url: 'https://youtube.com/playlist?list=PLdOKnrf8EcP17p05q13WXbHO5Z_JfXNpw&si=ajoT2b1Kq6vOsWpu', type: 'video' },
        { name: 'BroCode DBMS', url: 'https://www.youtube.com/c/BroCode', type: 'video' },
        { name: 'Mosh SQL Playlist', url: 'https://www.youtube.com/playlist?list=PLT3aH2pHS8dQwR0cfS3QpLQwF6NlgoB6Y', type: 'video' },
        { name: 'Apna College DBMS', url: 'https://www.youtube.com/playlist?list=PLJc3Vg4EJnk6lP1kzQG1Cgk8Yv0ugfbZp', type: 'video' }
      ]
    },
    {
      id: 3,
      title: 'Computer Networks',
      description: 'Network protocols, OSI model, TCP/IP, routing, and wireless networks.',
      icon: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01',
      category: 'core',
      resources: [
        { name: 'Computer Networking: A Top-Down Approach', url: 'https://www.amazon.com/Computer-Networking-Top-Down-Approach-7th/dp/0133594149', type: 'link' },
        { name: 'Computer Networks - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/computer-network-tutorials/', type: 'link' },
        { name: 'Stanford CS144 - Introduction to Computer Networking', url: 'https://cs144.github.io/', type: 'link' },
        { name: 'Gate Smashers Computer Networks Playlist', url: 'https://www.youtube.com/playlist?list=PLT8m24nAbY7Z7kswbh3Lg-B0MPT9J6gpF', type: 'video' },
        { name: 'GeeksforGeeks Interview Q&A', url: 'https://www.geeksforgeeks.org/computer-networking-interview-questions/', type: 'link' }
      ]
    },
    {
      id: 4,
      title: 'Computer Architecture',
      description: 'CPU design, memory hierarchy, pipelining, and computer organization.',
      icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z',
      category: 'core',
      resources: [
        { name: 'Computer Organization and Design', url: 'https://www.amazon.com/Computer-Organization-Design-MIPS-Architecture/dp/0124077269', type: 'link' },
        { name: 'Computer Architecture - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/computer-organization-and-architecture-tutorials/', type: 'link' },
        { name: 'Nand2Tetris', url: 'https://www.nand2tetris.org/', type: 'link' },
        { name: 'Gate Smashers Computer Architecture', url: 'https://www.youtube.com/playlist?list=PLT8m24nAbY7YUakrFJUAXYgQ8FD-2J5gu', type: 'video' },
        { name: 'Jenny\'s Lectures Computer Architecture', url: 'https://www.youtube.com/playlist?list=PLs5TII3vJGx83QS8C6EHGNK_SKnMxdJ_d', type: 'video' }
      ]
    },
    {
      id: 5,
      title: 'Data Structures and Algorithms',
      description: 'Arrays, linked lists, trees, graphs, sorting, searching, and algorithm design techniques.',
      icon: 'M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5',
      category: 'core',
      resources: [
        { name: 'Striver\'s DSA Playlist', url: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz', type: 'video' },
        { name: 'Love Babbar DSA Playlist', url: 'https://www.youtube.com/playlist?list=PLDzeHZWIZsTryvtXdMr6rPh4IDexB5NIA', type: 'video' },
        { name: 'Aditya Verma DSA Playlist', url: 'https://www.youtube.com/c/AdityaVermaTheProgrammingLord/playlists', type: 'video' },
        { name: 'Coder Army DSA', url: 'https://www.youtube.com/playlist?list=PLGjykzwGKCUGikGfEpzNYZVFQXOGcDKNr', type: 'video' },
        { name: 'Striver SDE Sheet', url: 'https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/', type: 'link' },
        { name: 'Love Babbar SDE Sheet', url: 'https://450dsa.com/', type: 'link' },
        { name: 'Fraz SDE Sheet', url: 'https://docs.google.com/spreadsheets/d/1-wKcV99KtO91dXdPkwmXGTdtyxAfk1mbPXQg81R9sFE/edit', type: 'link' },
        { name: 'GeeksforGeeks DSA', url: 'https://www.geeksforgeeks.org/data-structures/', type: 'link' }
      ]
    },
    {
      id: 6,
      title: 'Programming Languages',
      description: 'C/C++, Java, Python, JavaScript, and other programming languages.',
      icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
      category: 'core',
      resources: [
        { name: 'GeeksforGeeks C++', url: 'https://www.geeksforgeeks.org/c-plus-plus/', type: 'link' },
        { name: 'GeeksforGeeks Java', url: 'https://www.geeksforgeeks.org/java/', type: 'link' },
        { name: 'GeeksforGeeks Python', url: 'https://www.geeksforgeeks.org/python-programming-language/', type: 'link' },
        { name: 'GeeksforGeeks JavaScript', url: 'https://www.geeksforgeeks.org/javascript/', type: 'link' },
        { name: 'FreeCodeCamp JavaScript Course', url: 'https://www.youtube.com/watch?v=PkZNo7MFNFg', type: 'video' },
        { name: 'Tech With Tim Python', url: 'https://www.youtube.com/playlist?list=PLzMcBGfZo4-mFu00qxl0a67RhjjZj3jXm', type: 'video' },
        { name: 'Codecademy', url: 'https://www.codecademy.com/', type: 'link' },
        { name: 'Namaste JavaScript', url: 'https://youtube.com/playlist?list=PLlasXeu85E9cQ32gLCvAvr9vNaUccPVNP&si=ojvQ3_u6zrCIE9q7', type: 'video' },
        { name: 'Namaste React', url: 'https://www.youtube.com/playlist?list=PLlasXeu85E9fC_xI8alPjX4EVhnHfQr5J', type: 'video' }
      ]
    },
    {
      id: 7,
      title: 'MERN Stack and React',
      description: 'MongoDB, Express.js, React, and Node.js for full-stack development.',
      icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6',
      category: 'advanced',
      resources: [
        { name: 'freeCodeCamp MERN Stack Course', url: 'https://www.youtube.com/watch?v=7CqJlxBYj-M', type: 'video' },
        { name: 'Net Ninja MERN Stack (Hindi)', url: 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9iJ_KkrkBZWZRHVwnzLIoUE', type: 'video' },
        { name: 'Thapa Technical MERN (Hindi)', url: 'https://www.youtube.com/playlist?list=PLwGdqUZWnOp3t3qT7pvAznwUDzKbhEcCc', type: 'video' },
        { name: 'Code With Harry MERN (Hindi)', url: 'https://www.youtube.com/playlist?list=PLu0W_9lII9agx66oZnT6IyhcMIbUMNMdt', type: 'video' },
        { name: 'Traversy Media React Course', url: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8', type: 'video' },
        { name: 'React Official Docs', url: 'https://reactjs.org/docs/getting-started.html', type: 'link' },
        { name: 'CodeEvolution React (English)', url: 'https://www.youtube.com/playlist?list=PLC3y8-rFHvwgg3vaYJgHGnModB54rxOk3', type: 'video' },
        { name: 'Net Ninja React (English)', url: 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9gZD-Tvwfod2gaISzfRiP9d', type: 'video' }
      ]
    },
    {
      id: 5,
      title: 'System Design',
      description: 'Scalability, high availability, load balancing, caching, and microservices.',
      icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z',
      category: 'advanced',
      resources: [
        { name: 'System Design Interview', url: 'https://www.amazon.com/System-Design-Interview-insiders-Second/dp/B08CMF2CQF', type: 'link' },
        { name: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', type: 'link' },
        { name: 'Designing Data-Intensive Applications', url: 'https://www.amazon.com/Designing-Data-Intensive-Applications-Systems-Architecture/dp/1449373321', type: 'link' },
        { name: 'Gaurav Sen System Design Playlist', url: 'https://www.youtube.com/playlist?list=PLBzjlHjI_iYfL6w5Fw0v-2cX16Pmxgoy2', type: 'video' },
        { name: 'Design Gurus System Design Playlist', url: 'https://www.youtube.com/playlist?list=PLsFlxJkFnn8wRSgQdgdUya0xLfueWZvQF', type: 'video' },
        { name: 'Shreyans System Design', url: 'https://www.youtube.com/playlist?list=PL564gOx0bCLouDCUMtmj6hMEu1JS7QYEr', type: 'video' },
        { name: 'SudoCode System Design', url: 'https://www.youtube.com/channel/UCMrRRZxUAXRzjai0SSoFgdw', type: 'video' },
        { name: 'GeeksforGeeks System Design', url: 'https://www.geeksforgeeks.org/system-design-tutorial/', type: 'link' }
      ]
    },
    {
      id: 9,
      title: 'Machine Learning',
      description: 'Supervised and unsupervised learning, neural networks, and deep learning.',
      icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      category: 'advanced',
      resources: [
        { name: 'Krish Naik ML Playlist', url: 'https://www.youtube.com/playlist?list=PLZoTAELRMXVPBTrWtJkn3wWQxZkmTXGwe', type: 'video' },
        { name: 'Andrew Ng Machine Learning', url: 'https://www.coursera.org/learn/machine-learning', type: 'link' },
        { name: 'Stanford CS229', url: 'https://www.youtube.com/playlist?list=PLoROMvodv4rMiGQp3WXShtMGgzqpfVfbU', type: 'video' },
        { name: 'StatQuest Machine Learning', url: 'https://www.youtube.com/playlist?list=PLblh5JKOoLUICTaGLRoHQDuF_7q2GfuJF', type: 'video' },
        { name: 'GeeksforGeeks ML', url: 'https://www.geeksforgeeks.org/machine-learning/', type: 'link' }
      ]
    },
    {
      id: 10,
      title: 'Artificial Intelligence',
      description: 'AI principles, knowledge representation, reasoning, and planning.',
      icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0.199 5c0 2.21-3.582 4-8 4s-8-1.79-8-4',
      category: 'advanced',
      resources: [
        { name: 'MIT Introduction to AI', url: 'https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-034-artificial-intelligence-fall-2010/', type: 'link' },
        { name: 'Stanford CS221', url: 'https://www.youtube.com/playlist?list=PLoROMvodv4rO1NB9TD4iUZ3qghGEGtqNX', type: 'video' },
        { name: 'Edureka AI Tutorial', url: 'https://www.youtube.com/watch?v=JMUxmLyrhSk', type: 'video' },
        { name: 'IBM AI Tutorial', url: 'https://www.youtube.com/watch?v=i_JBgYQGpvQ', type: 'video' },
        { name: 'GeeksforGeeks AI', url: 'https://www.geeksforgeeks.org/artificial-intelligence-an-introduction/', type: 'link' }
      ]
    },
    {
      id: 11,
      title: 'Object-Oriented Programming',
      description: 'Encapsulation, inheritance, polymorphism, and abstraction.',
      icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
      category: 'core',
      resources: [
        { name: 'GeeksforGeeks OOP in C++', url: 'https://www.geeksforgeeks.org/object-oriented-programming-in-cpp/', type: 'link' },
        { name: 'GeeksforGeeks OOP in Java', url: 'https://www.geeksforgeeks.org/object-oriented-programming-oops-concept-in-java/', type: 'link' },
        { name: 'GeeksforGeeks OOP in Python', url: 'https://www.geeksforgeeks.org/python-oops-concepts/', type: 'link' },
        { name: 'FreeCodeCamp OOP Course', url: 'https://www.youtube.com/watch?v=SiBw7os-_zI', type: 'video' },
        { name: 'Telusko OOP in Java', url: 'https://www.youtube.com/playlist?list=PLsyeobzWxl7oZ-fxDYkOToURHhMuWD1BK', type: 'video' },
        { name: 'Caleb Curry C++ OOP', url: 'https://www.youtube.com/playlist?list=PL_c9BZzLwBRLW7Kw8bqc_PmgKZgtaNYI9', type: 'video' },
        { name: 'Corey Schafer Python OOP', url: 'https://www.youtube.com/playlist?list=PL-osiE80TeTsqhIuOqKhwlXsIBIdSeYtc', type: 'video' }
      ]
    },
    {
      id: 12,
      title: 'Web Development',
      description: 'HTML, CSS, JavaScript, and web frameworks.',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      category: 'advanced',
      resources: [
        { name: 'W3Schools HTML', url: 'https://www.w3schools.com/html/', type: 'link' },
        { name: 'W3Schools CSS', url: 'https://www.w3schools.com/css/', type: 'link' },
        { name: 'W3Schools JavaScript', url: 'https://www.w3schools.com/js/', type: 'link' },
        { name: 'GeeksforGeeks Web Development', url: 'https://www.geeksforgeeks.org/web-development/', type: 'link' },
        { name: 'Traversy Media Web Dev Crash Course', url: 'https://www.youtube.com/watch?v=UB1O30fR-EE', type: 'video' },
        { name: 'Net Ninja HTML & CSS', url: 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9ivBf_eKCPIAYXWzLlPAm6G', type: 'video' },
        { name: 'freeCodeCamp Web Development', url: 'https://www.youtube.com/watch?v=mU6anWqZJcc', type: 'video' },
        { name: 'CodeWithHarry Web Dev (Hindi)', url: 'https://www.youtube.com/playlist?list=PLu0W_9lII9agiCUZYRsvtGTXdxkzPyItg', type: 'video' }
      ]
    },
    {
      id: 13,
      title: 'Software Engineering',
      description: 'Software development life cycle, agile methodologies, and software testing.',
      icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
      category: 'advanced',
      resources: [
        { name: 'Software Engineering - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/software-engineering/', type: 'link' },
        { name: 'MIT Software Engineering Lectures', url: 'https://www.youtube.com/playlist?list=PLUl4u3cNGP62QasITv2rNJ6MrVWGE3tLc', type: 'video' },
        { name: 'Google Tech Dev Guide', url: 'https://techdevguide.withgoogle.com/', type: 'link' },
        { name: 'Jenny\'s Software Engineering', url: 'https://www.youtube.com/playlist?list=PLs5TII3vJGx0kLSXM-flIDO8CQKLTKzkw', type: 'video' },
        { name: 'Gate Smashers Software Engineering', url: 'https://www.youtube.com/playlist?list=PLT8m24nAbY7ZMDzMw3kSUwLCZzUmM8Q8y', type: 'video' }
      ]
    },
    {
      id: 14,
      title: 'Cyber Security',
      description: 'Network security, cryptography, penetration testing, and ethical hacking.',
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      category: 'advanced',
      resources: [
        { name: 'Cyber Security - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/cyber-security/', type: 'link' },
        { name: 'FreeCodeCamp Ethical Hacking', url: 'https://www.youtube.com/watch?v=3Kq1MIfTWCE', type: 'video' },
        { name: 'Computerphile Security Videos', url: 'https://www.youtube.com/playlist?list=PLzH6n4zXuckpfMu_4Ff8E7Z1behQks5ba', type: 'video' },
        { name: 'Network Chuck Security', url: 'https://www.youtube.com/playlist?list=PLIhvC56v63ILPDA2DQBv0IKzqsWTZxCkp', type: 'video' },
        { name: 'David Bombal Ethical Hacking', url: 'https://www.youtube.com/playlist?list=PLhfrWIlLOoKMc3LxrFlGKfvgoiA7PwC-0', type: 'video' }
      ]
    }
  ];

  useEffect(() => {
    if (popupVideo || popupContent) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [popupVideo, popupContent]);

  const handlePopupClose = () => {
    setPopupVideo(null);
    setPopupContent(null);
  };

  const handlePopupOpen = (resource) => {
    if (resource.type === 'video') {
      setPopupVideo(resource.url);
    } else {
      setPopupContent(resource);
    }
  };

  const getYoutubeEmbedUrl = (url) => {
    // Extract video ID from various YouTube URL formats
    let videoId = '';
    if (url.includes('youtube.com/watch')) {
      videoId = new URLSearchParams(url.split('?')[1]).get('v');
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('youtube.com/playlist')) {
      videoId = new URLSearchParams(url.split('?')[1]).get('list');
      return `https://www.youtube.com/embed/videoseries?list=${videoId}`;
    }
    
    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with search and tabs */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <h1 className="text-3xl font-bold text-white">CS Fundamentals</h1>
            
            {/* Search input with improved design */}
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-800 border border-gray-700 pl-10 pr-4 py-2 w-full rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Section tabs */}
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                activeTab === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('core')}
              className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                activeTab === 'core'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Core
            </button>
            <button
              onClick={() => setActiveTab('advanced')}
              className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                activeTab === 'advanced'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Advanced
            </button>
          </div>
        </div>

        {/* Topics grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics
            .filter((topic) =>
              topic.category === activeTab || activeTab === 'all'
            )
            .filter((topic) =>
              topic.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((topic, index) => (
              <div key={`topic-${topic.id || index}`} className="bg-gray-800 hover:bg-gray-700 p-6 rounded-lg transition-all duration-300 shadow-lg border border-gray-700 hover:border-indigo-500">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-indigo-500 rounded-lg">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={topic.icon} />
                    </svg>
                  </div>
                  <h2 className="ml-3 text-xl font-semibold text-white">{topic.title}</h2>
                </div>
                <p className="text-gray-300 mb-4">{topic.description}</p>
                <div className="flex flex-wrap gap-2">
                  {topic.resources.map((resource, index) => (
                    <button
                      key={index}
                      onClick={() => handlePopupOpen(resource)}
                      className="px-3 py-1 bg-gray-700 hover:bg-indigo-600 text-white text-sm rounded-md transition-colors duration-200"
                    >
                      {resource.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
        </div>

        {/* Popup */}
        {(popupVideo || popupContent) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg shadow-xl w-[90%] max-w-2xl mx-4 overflow-hidden border border-gray-700">
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-white">
                    {popupVideo ? 'Video Resource' : popupContent?.name}
                  </h3>
                  <button
                    onClick={handlePopupClose}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {popupVideo ? (
                  <div>
                    <div className="flex gap-2 mb-2">
                      <a
                        href={popupVideo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-md transition-colors duration-200"
                      >
                        Open in new window
                      </a>
                      <button
                        onClick={handlePopupClose}
                        className="inline-block px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors duration-200"
                      >
                        Stop
                      </button>
                    </div>
                    <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
                      <iframe
                        src={getYoutubeEmbedUrl(popupVideo)}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute top-0 left-0 w-full h-full rounded-lg"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-300">
                    <p className="mb-2 text-sm">This resource is available at:</p>
                    <a
                      href={popupContent?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 break-all text-sm"
                    >
                      {popupContent?.url}
                    </a>
                    <div className="mt-3">
                      <a
                        href={popupContent?.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-md transition-colors duration-200"
                      >
                        Open in new tab
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CSFundamentals;