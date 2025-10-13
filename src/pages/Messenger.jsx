import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Send, Paperclip, Smile, MoreVertical, Phone, Video, Search, X, Image as ImageIcon, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Messenger = () => {
  const { t } = useTranslation();
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  const [chats, setChats] = useState([
    {
      id: 1,
      name: 'Alice Johnson',
      avatar: 'AJ',
      lastMessage: 'Hey! How are you doing?',
      time: '10:30 AM',
      unread: 2,
      online: true,
      messages: [
        { id: 1, text: 'Hey! How are you doing?', sender: 'other', time: '10:30 AM' },
        { id: 2, text: 'I\'m good, thanks! How about you?', sender: 'me', time: '10:32 AM' },
        { id: 3, text: 'Great! Want to grab lunch later?', sender: 'other', time: '10:35 AM' },
      ]
    },
    {
      id: 2,
      name: 'Bob Smith',
      avatar: 'BS',
      lastMessage: 'Did you see the latest updates?',
      time: 'Yesterday',
      unread: 0,
      online: false,
      messages: [
        { id: 1, text: 'Did you see the latest updates?', sender: 'other', time: 'Yesterday 4:20 PM' },
        { id: 2, text: 'Yes, looks amazing!', sender: 'me', time: 'Yesterday 4:25 PM' },
      ]
    },
    {
      id: 3,
      name: 'Carol White',
      avatar: 'CW',
      lastMessage: 'Thanks for your help!',
      time: '2 days ago',
      unread: 0,
      online: true,
      messages: [
        { id: 1, text: 'Can you help me with the project?', sender: 'other', time: '2 days ago 2:15 PM' },
        { id: 2, text: 'Sure! What do you need?', sender: 'me', time: '2 days ago 2:20 PM' },
        { id: 3, text: 'Thanks for your help!', sender: 'other', time: '2 days ago 3:45 PM' },
      ]
    },
    {
      id: 4,
      name: 'David Brown',
      avatar: 'DB',
      lastMessage: 'See you tomorrow!',
      time: '3 days ago',
      unread: 0,
      online: false,
      messages: [
        { id: 1, text: 'Let\'s meet tomorrow at 3 PM', sender: 'other', time: '3 days ago 5:00 PM' },
        { id: 2, text: 'Sounds good to me!', sender: 'me', time: '3 days ago 5:05 PM' },
        { id: 3, text: 'See you tomorrow!', sender: 'other', time: '3 days ago 5:10 PM' },
      ]
    },
    {
      id: 5,
      name: 'Emma Davis',
      avatar: 'ED',
      lastMessage: '👍',
      time: 'Last week',
      unread: 0,
      online: true,
      messages: [
        { id: 1, text: 'Great job on the presentation!', sender: 'other', time: 'Last week' },
        { id: 2, text: 'Thank you so much!', sender: 'me', time: 'Last week' },
        { id: 3, text: '👍', sender: 'other', time: 'Last week' },
      ]
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat, chats]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat) return;

    const newMessage = {
      id: Date.now(),
      text: message,
      sender: 'me',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === selectedChat.id
          ? {
              ...chat,
              messages: [...chat.messages, newMessage],
              lastMessage: message,
              time: 'Just now'
            }
          : chat
      )
    );

    setMessage('');
  };

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentChat = chats.find(chat => chat.id === selectedChat?.id);

  return (
    <div className="p-6" style={{background: 'transparent'}}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-2xl font-semibold text-foreground">{t('messenger.title')}</h1>
        <span className="text-sm text-subtle ml-auto">
          {filteredChats.length} {filteredChats.length === 1 ? t('messenger.conversations') : t('messenger.conversations_plural')}
          {selectedChat && ` • ${t('messenger.active')}`}
        </span>
      </div>

      <div className="table-wrapper overflow-hidden h-[calc(100vh-180px)]" style={{background: 'hsl(var(--panel))'}}>
        <div className="grid grid-cols-12 h-full">
          {/* Sidebar - Chat List */}
          <div className="col-span-12 md:col-span-4 border-r border-border flex flex-col" style={{background: 'hsl(var(--panel))'}}>
            {/* Search Bar */}
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-subtle" />
                <input
                  type="text"
                  placeholder={t('messenger.search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input w-full pl-10 pr-4 text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`p-4 border-b border-border cursor-pointer transition-all ${
                    selectedChat?.id === chat.id
                      ? 'border-l-2 border-l-accent'
                      : 'border-l-2 border-l-transparent hover:border-l-subtle'
                  }`}
                  style={{background: selectedChat?.id === chat.id ? 'color-mix(in srgb, hsl(var(--accent)) 8%, hsl(var(--panel)))' : undefined}}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm" style={{background: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))'}}>
                        {chat.avatar}
                      </div>
                      {chat.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2" style={{borderColor: 'hsl(var(--panel))'}}></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-semibold text-foreground truncate">
                          {chat.name}
                        </h3>
                        <span className="text-xs text-subtle whitespace-nowrap ml-2">
                          {chat.time}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-subtle truncate">
                          {chat.lastMessage}
                        </p>
                        {chat.unread > 0 && (
                          <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full" style={{background: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))'}}>
                            {chat.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="col-span-12 md:col-span-8 flex flex-col" style={{background: 'hsl(var(--bg))'}}>
            {currentChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-border flex items-center justify-between" style={{background: 'hsl(var(--panel))'}}>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm" style={{background: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))'}}>
                        {currentChat.avatar}
                      </div>
                      {currentChat.online && (
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full border-2" style={{borderColor: 'hsl(var(--panel))'}}></div>
                      )}
                    </div>
                    <div>
                      <h2 className="font-semibold text-foreground">{currentChat.name}</h2>
                      <p className="text-xs text-subtle">
                        {currentChat.online ? t('messenger.activeNow') : t('messenger.offline')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="btn btn-ghost p-2" title={t('messenger.voiceCall')} onClick={() => toast(t('messenger.voiceCall'))}>
                      <Phone className="w-5 h-5" />
                    </button>
                    <button className="btn btn-ghost p-2" title={t('messenger.videoCall')} onClick={() => toast(t('messenger.videoCall'))}>
                      <Video className="w-5 h-5" />
                    </button>
                    <button className="btn btn-ghost p-2" title={t('messenger.moreOptions')} onClick={() => toast(t('messenger.moreOptions'))}>
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {currentChat.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                          msg.sender === 'me'
                            ? 'rounded-br-sm'
                            : 'rounded-bl-sm'
                        }`}
                        style={{
                          background: msg.sender === 'me' 
                            ? 'hsl(var(--accent))' 
                            : 'hsl(var(--panel))',
                          color: msg.sender === 'me'
                            ? 'hsl(var(--accent-foreground))'
                            : 'hsl(var(--text))',
                          border: msg.sender === 'me' ? 'none' : '1px solid hsl(var(--border))'
                        }}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <p
                          className="text-xs mt-1 opacity-70"
                        >
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-border" style={{background: 'hsl(var(--panel))'}}>
                  <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="btn btn-ghost p-2"
                        onClick={() => toast(t('messenger.imageUpload'))}
                        title={t('messenger.imageUpload')}
                      >
                        <ImageIcon className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost p-2"
                        onClick={() => toast(t('messenger.fileAttachment'))}
                        title={t('messenger.fileAttachment')}
                      >
                        <Paperclip className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder={t('messenger.typeMessage')}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="input w-full pr-10 pl-3 text-sm"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
                        onClick={() => toast(t('messenger.emojiPicker'))}
                        title={t('messenger.emojiPicker')}
                      >
                        <Smile className="w-5 h-5 text-subtle" />
                      </button>
                    </div>
                    <button
                      type="submit"
                      disabled={!message.trim()}
                      className="btn btn-primary px-3"
                      title={t('messenger.sendMessage')}
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{background: 'hsl(var(--muted))'}}>
                    <MessageSquare className="w-10 h-10 text-subtle" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {t('messenger.selectConversation')}
                  </h3>
                  <p className="text-subtle">
                    {t('messenger.chooseChat')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feature Info */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div style={{background: 'hsl(var(--panel))'}} className="border border-border rounded-lg p-4">
          <h3 className="font-semibold text-foreground mb-2">{t('messenger.features.messaging.title')}</h3>
          <p className="text-sm text-subtle">
            {t('messenger.features.messaging.description')}
          </p>
        </div>
        <div style={{background: 'hsl(var(--panel))'}} className="border border-border rounded-lg p-4">
          <h3 className="font-semibold text-foreground mb-2">{t('messenger.features.onlineStatus.title')}</h3>
          <p className="text-sm text-subtle">
            {t('messenger.features.onlineStatus.description')}
          </p>
        </div>
        <div style={{background: 'hsl(var(--panel))'}} className="border border-border rounded-lg p-4">
          <h3 className="font-semibold text-foreground mb-2">{t('messenger.features.search.title')}</h3>
          <p className="text-sm text-subtle">
            {t('messenger.features.search.description')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Messenger;
