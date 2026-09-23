import React from 'react';

import {
  Home,
  Bookmark,
  User,
  Shield,
  MessageCircle,
  LogOut,
  ExternalLink
} from 'lucide-react';


import {
  Link,
  useLocation,
  useNavigate
} from 'react-router-dom';

export const Sidebar = () => {

  const location = useLocation();

  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem('token');
    localStorage.removeItem('user');

    navigate('/login', {
      replace: true
    });

    window.location.reload();
  };

  const links = [

    {
      name: 'Home',
      icon: Home,
      path: '/dashboard'
    },

    {
      name: 'Bookmarks',
      icon: Bookmark,
      path: '/bookmarks'
    },

    {
      name: 'Profile',
      icon: User,
      path: '/profile'
    },

    {
      name: 'Admin',
      icon: Shield,
      path: '/admin'
    }

  ];

  const rooms = [

    'Angry',
    'Sad',
    'Happy',
    'Confused'

  ];

  return (

    <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border p-5 overflow-y-auto flex flex-col">

      {/* LOGO */}

      <h1 className="text-3xl font-bold text-white mb-10">

        ShadowRoom

      </h1>

      {/* CONTENT */}

      <div className="flex-1">

        {/* MAIN LINKS */}

        <div className="space-y-3 mb-10">

          {links.map((link) => {

            const Icon = link.icon;

            return (

              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  location.pathname === link.path
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-secondary'
                }`}
              >

                <Icon size={20} />

                <span>
                  {link.name}
                </span>

              </Link>

            );
          })}

        </div>

        {/* CHAT ROOMS */}

        <div>

          <h2 className="text-gray-400 text-sm uppercase mb-4">

            Support Rooms

          </h2>

          <div className="space-y-3">

            {rooms.map((room) => (

              <Link
                key={room}
                to={`/chatroom/${room}`}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-secondary transition-all"
              >

                <MessageCircle size={18} />

                <span>
                  {room} Room
                </span>

              </Link>

            ))}

          </div>

        </div>

      </div>

      {/* Need Someone to Talk To? */}

<div className="mt-8">

  <div className="bg-card border border-border rounded-2xl p-4">

    <h3 className="font-semibold text-white mb-2">

      AI Companion

    </h3>

    <p className="text-xs text-muted-foreground mb-4">

      A private space to reflect, vent, and be heard.

    </p>

    <button
      onClick={() => navigate('/chatbot')}
      className="
        w-full
        bg-purple-600
        hover:bg-purple-700
        text-white
        rounded-lg
        py-2.5
        flex
        items-center
        justify-center
        gap-2
        transition-all
      "
    >

      <ExternalLink size={16} />

     Start Conversation

    </button>

  </div>

</div>

      {/* LOGOUT */}

      <div className="pt-5 border-t border-border">

        <button
          onClick={handleLogout}
          className="
            w-full
            flex
            items-center
            gap-3
            px-4
            py-3
            rounded-xl
            text-red-400
            hover:bg-red-500/10
            transition-all
          "
        >

          <LogOut size={20} />

          <span>
            Logout
          </span>

        </button>

      </div>

    </aside>

  );
};

export default Sidebar;