(function() {
  'use strict';
  
  const WIDGET_CONFIG = {
    apiUrl: window.HOMIO_WIDGET_API_URL || 'http://localhost:3000/api/chat',
    containerId: 'homio-ai-widget-container'
  };

  if (document.getElementById(WIDGET_CONFIG.containerId)) {
    return;
  }

  const loadFont = () => {
    if (document.getElementById('homio-widget-font')) return;
    const link = document.createElement('link');
    link.id = 'homio-widget-font';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    document.head.appendChild(link);
  };

  const SVG_TEMPLATES = {
    sparkle: '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>',
    send: '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
    chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'
  };

  const getIconSvg = (type, opts = {}) => {
    const { w = 24, h = 24, stroke = 'currentColor', strokeWidth = 2, strokeLinecap = 'round', strokeLinejoin = 'round' } = opts;
    const paths = SVG_TEMPLATES[type] || SVG_TEMPLATES.sparkle;
    const attrs = [
      `width="${w}"`,
      `height="${h}"`,
      `viewBox="0 0 24 24"`,
      'fill="none"',
      `stroke="${stroke}"`,
      `stroke-width="${strokeWidth}"`,
      `stroke-linecap="${strokeLinecap}"`,
      `stroke-linejoin="${strokeLinejoin}"`
    ];
    return `<svg ${attrs.join(' ')}>${paths}</svg>`;
  };

  const getStyles = () => {
    loadFont();
    return `*{font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}.homio-widget-button{position:absolute;bottom:1rem;right:1rem;width:3.5rem;height:3.5rem;border-radius:9999px;background:linear-gradient(135deg,#2563eb,#7c3aed);color:#fff;border:0;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 20px 25px -5px rgba(0,0,0,.1),0 10px 10px -5px rgba(0,0,0,.04);transition:all .3s}.homio-widget-button:hover{transform:scale(1.1);box-shadow:0 20px 25px -5px rgba(37,99,235,.5)}.homio-widget-popover{position:absolute;bottom:calc(3.5rem + 1.5rem);right:0;width:calc(100vw - 1.5rem);max-width:480px;max-height:calc(100vh - 6rem);background:#fff;border-radius:1rem;border:2px solid #e5e7eb;box-shadow:0 20px 25px -5px rgba(0,0,0,.1);display:none;flex-direction:column;overflow:hidden}.homio-widget-popover.open{display:flex}.homio-widget-header{padding:1.5rem;border-bottom:1px solid #e5e7eb;background:linear-gradient(90deg,#fff,#f9fafb)}.homio-widget-header-content{display:flex;align-items:center;gap:.75rem}.homio-widget-avatar{width:2.5rem;height:2.5rem;border-radius:9999px;background:linear-gradient(135deg,#2563eb,#7c3aed);display:flex;align-items:center;justify-content:center;position:relative}.homio-widget-status{position:absolute;bottom:0;right:0;width:.75rem;height:.75rem;background:#10b981;border-radius:9999px;border:2px solid #fff}.homio-widget-title{font-size:1.125rem;font-weight:700;color:#111827;margin:0}.homio-widget-subtitle{font-size:.75rem;color:#6b7280;margin:0}.homio-widget-messages{flex:1;overflow-y:auto;padding:1rem 1.5rem;background:linear-gradient(180deg,#fff,#f9fafb);min-height:180px}.homio-widget-message{display:flex;flex-direction:column;gap:.25rem;margin-bottom:1rem}.homio-widget-message.user{align-items:flex-end}.homio-widget-message.assistant{align-items:flex-start}.homio-widget-message-bubble{padding:.75rem 1rem;border-radius:1rem;max-width:90%;font-size:.875rem;line-height:1.5}.homio-widget-message.user .homio-widget-message-bubble{background:linear-gradient(135deg,#2563eb,#7c3aed);color:#fff;border-bottom-right-radius:.25rem}.homio-widget-message.assistant .homio-widget-message-bubble{background:#f3f4f6;color:#111827;border:2px solid #e5e7eb;border-bottom-left-radius:.25rem}.homio-widget-message-time{font-size:.625rem;color:#9ca3af;padding:0 .5rem}.homio-widget-empty{text-align:center;padding:2rem 1rem}.homio-widget-empty-icon{width:4rem;height:4rem;margin:0 auto 1rem;border-radius:9999px;background:linear-gradient(135deg,#dbeafe,#e9d5ff);display:flex;align-items:center;justify-content:center}.homio-widget-suggestions{margin-top:1.5rem}.homio-widget-suggestion{width:100%;text-align:left;padding:.75rem 1rem;margin-bottom:.5rem;border-radius:.5rem;background:#f3f4f6;border:2px solid #e5e7eb;font-size:.875rem;color:#374151;cursor:pointer;transition:all .2s}.homio-widget-suggestion:hover{border-color:rgba(37,99,235,.5);color:#2563eb}.homio-widget-suggestion:disabled{opacity:.5;cursor:not-allowed}.homio-widget-input-area{padding:1rem 1.5rem;border-top:1px solid #e5e7eb;background:#fff}.homio-widget-form{display:flex;gap:.5rem}.homio-widget-input{flex:1;padding:.625rem 1rem;border-radius:.75rem;border:2px solid #e5e7eb;background:#f9fafb;font-size:.875rem;color:#111827}.homio-widget-input:focus{outline:0;ring:2px;ring-color:#2563eb;border-color:transparent}.homio-widget-submit{padding:.625rem 1.25rem;border-radius:.75rem;background:linear-gradient(90deg,#2563eb,#7c3aed);color:#fff;border:0;font-weight:500;cursor:pointer;transition:all .2s}.homio-widget-submit:hover:not(:disabled){transform:scale(1.05);box-shadow:0 10px 15px -3px rgba(0,0,0,.1)}.homio-widget-submit:disabled{opacity:.5;cursor:not-allowed}.homio-widget-loading{display:flex;align-items:center;gap:.5rem;padding:.75rem 1rem;background:#f3f4f6;border:2px solid #e5e7eb;border-radius:1rem;border-bottom-left-radius:.25rem}.homio-widget-dots{display:flex;gap:.25rem}.homio-widget-dot{width:.5rem;height:.5rem;border-radius:9999px;background:#2563eb;animation:bounce 1.4s infinite}.homio-widget-dot:nth-child(2){background:#7c3aed;animation-delay:.15s}.homio-widget-dot:nth-child(3){animation-delay:.3s}@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-.25rem)}}.homio-widget-error{font-size:.75rem;color:#dc2626;margin-top:.5rem;padding:.5rem .75rem;background:#fef2f2;border:1px solid #fecaca;border-radius:.5rem}`;
  };

  const createWidget = () => {
    const container = document.createElement('div');
    container.id = WIDGET_CONFIG.containerId;
    container.style.cssText = 'position:fixed;bottom:0;right:0;z-index:999999;pointer-events:none';
    document.body.appendChild(container);
    
    const shadow = container.attachShadow({ mode: 'closed' });
    
    const style = document.createElement('style');
    style.textContent = getStyles();
    shadow.appendChild(style);
    
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'pointer-events:auto';
    
    const button = document.createElement('button');
    button.className = 'homio-widget-button';
    button.setAttribute('aria-label', 'Pergunte à IA - Assistente Liv');
    button.innerHTML = getIconSvg('sparkle', { w: 24, h: 24 });
    
    const popover = document.createElement('div');
    popover.className = 'homio-widget-popover';
    
    popover.innerHTML = `<div class="homio-widget-header"><div class="homio-widget-header-content"><div class="homio-widget-avatar">${getIconSvg('sparkle', { w: 20, h: 20, stroke: 'white' })}<div class="homio-widget-status"></div></div><div><h2 class="homio-widget-title">Pergunte a Liv</h2><p class="homio-widget-subtitle">Assistente de documentação do Homio</p></div></div></div><div class="homio-widget-messages" id="homio-widget-messages"></div><div class="homio-widget-input-area"><form id="homio-widget-form" class="homio-widget-form"><input type="text" id="homio-widget-input" class="homio-widget-input" placeholder="Digite sua pergunta..." autocomplete="off"/><button type="submit" class="homio-widget-submit" id="homio-widget-submit">${getIconSvg('send', { w: 16, h: 16 })}</button></form><div id="homio-widget-error"></div></div>`;
    
    wrapper.appendChild(button);
    wrapper.appendChild(popover);
    shadow.appendChild(wrapper);
    
    let messages = [];
    let isLoading = false;
    let isOpen = false;
    
    const suggestedQuestions = [
      'Como configurar notificações por email?',
      'Como criar um pipeline de vendas?',
      'Como usar campos personalizados?',
      'Como integrar WhatsApp?'
    ];
    
    const formatTime = (date) => {
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };
    
    const messagesContainer = shadow.getElementById('homio-widget-messages');
    let currentAssistantBubble = null;
    let currentAssistantMessageEl = null;
    
    const renderMessages = () => {
      if (messages.length === 0) {
        messagesContainer.innerHTML = `<div class="homio-widget-empty"><div class="homio-widget-empty-icon">${getIconSvg('chat', { w: 32, h: 32, stroke: '#2563eb' })}</div><p style="font-weight:600;color:#111827;margin-bottom:.5rem">Olá! Como posso ajudar?</p><p style="font-size:.75rem;color:#6b7280;margin-bottom:1.5rem">Estou aqui para responder suas dúvidas sobre o sistema Homio</p><div class="homio-widget-suggestions"><p style="font-size:.75rem;font-weight:600;color:#374151;margin-bottom:.75rem">Perguntas sugeridas:</p>${suggestedQuestions.map((q,i)=>`<button class="homio-widget-suggestion" data-question="${i}" ${isLoading?'disabled':''}><span style="display:inline-block;vertical-align:middle;margin-right:.5rem">${getIconSvg('sparkle', { w: 14, h: 14, stroke: '#2563eb' })}</span>${q}</button>`).join('')}</div></div>`;
        
        suggestedQuestions.forEach((question, index) => {
          const btn = messagesContainer.querySelector(`[data-question="${index}"]`);
          if (btn) {
            btn.addEventListener('click', () => sendMessage(question));
          }
        });
        currentAssistantBubble = null;
        currentAssistantMessageEl = null;
        return;
      }
      
      const lastMessage = messages[messages.length - 1];
      const isLastAssistantStreaming = isLoading && lastMessage && lastMessage.role === 'assistant' && !lastMessage.content;
      
      const messagesToRender = isLastAssistantStreaming ? messages.slice(0, -1) : messages;
      
      messagesContainer.innerHTML = messagesToRender.map((msg) => {
        const isUser = msg.role === 'user';
        return `<div class="homio-widget-message ${isUser ? 'user' : 'assistant'}"><div class="homio-widget-message-bubble">${isUser ? escapeHtml(msg.content) : markdownToHtml(msg.content)}</div><span class="homio-widget-message-time">${formatTime(new Date(msg.createdAt || Date.now()))}</span></div>`;
      }).join('') + (isLoading ? `<div class="homio-widget-loading"><div class="homio-widget-dots"><div class="homio-widget-dot"></div><div class="homio-widget-dot"></div><div class="homio-widget-dot"></div></div><span style="font-size:.875rem;color:#6b7280">Pensando...</span></div>` : '');
      
      if (!isLastAssistantStreaming) {
        currentAssistantBubble = null;
        currentAssistantMessageEl = null;
      }
      
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };
    
    const updateAssistantMessage = (content) => {
      if (!currentAssistantBubble) {
        const existingMessages = messagesContainer.querySelectorAll('.homio-widget-message');
        const lastMsg = existingMessages[existingMessages.length - 1];
        
        if (lastMsg && lastMsg.classList.contains('assistant')) {
          currentAssistantMessageEl = lastMsg;
          currentAssistantBubble = lastMsg.querySelector('.homio-widget-message-bubble');
        } else {
          const messageEl = document.createElement('div');
          messageEl.className = 'homio-widget-message assistant';
          const bubble = document.createElement('div');
          bubble.className = 'homio-widget-message-bubble';
          const time = document.createElement('span');
          time.className = 'homio-widget-message-time';
          time.textContent = formatTime(new Date());
          
          messageEl.appendChild(bubble);
          messageEl.appendChild(time);
          messagesContainer.appendChild(messageEl);
          
          currentAssistantMessageEl = messageEl;
          currentAssistantBubble = bubble;
        }
      }
      
      if (currentAssistantBubble) {
        currentAssistantBubble.innerHTML = markdownToHtml(content);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    };
    
    const escapeHtml = (text) => {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    };
    
    const markdownToHtml = (text) => {
      let t = text.replace(/```([\s\S]+?)```/g, '<pre style="background:#e5e7eb;padding:.75rem;border-radius:.5rem;overflow-x:auto;margin:.75rem 0;font-size:.75rem;font-family:monospace;border:1px solid #d1d5db"><code>$1</code></pre>');
      t = t.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      t = t.replace(/(?:^|[^*])\*([^*\n]+?)\*(?![*])/g, '<em>$1</em>');
      return t
        .replace(/`([^`]+?)`/g, '<code style="background:#dbeafe;color:#1e40af;padding:.125rem .375rem;border-radius:.25rem;font-size:.75rem;font-family:monospace">$1</code>')
        .replace(/###\s(.+)/g, '<h3 style="font-size:.875rem;font-weight:600;margin:.5rem 0 .25rem;color:#111827">$1</h3>')
        .replace(/##\s(.+)/g, '<h2 style="font-size:.875rem;font-weight:700;margin:.75rem 0 .5rem;color:#111827">$1</h2>')
        .replace(/^#\s(.+)$/gm, '<h1 style="font-size:1rem;font-weight:700;margin:1rem 0 .5rem;color:#111827">$1</h1>')
        .replace(/^[\*\-]\s(.+)$/gm, '<li style="margin:.25rem 0">$1</li>')
        .replace(/^\d+\.\s(.+)$/gm, '<li style="margin:.25rem 0">$1</li>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:#2563eb;text-decoration:underline">$1</a>')
        .replace(/\n/g, '<br>');
    };
    
    const sendMessage = async (text) => {
      if (isLoading || !text.trim()) return;
      
      const userMessage = {
        role: 'user',
        content: text.trim(),
        createdAt: Date.now()
      };
      
      messages.push(userMessage);
      isLoading = true;
      renderMessages();
      
      const errorEl = shadow.getElementById('homio-widget-error');
      errorEl.textContent = '';
      
      try {
        const response = await fetch(WIDGET_CONFIG.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: messages.map(m => ({
              role: m.role,
              content: m.content
            }))
          })
        });
        
        if (!response.ok) {
          throw new Error('Erro ao enviar mensagem');
        }
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let assistantMessage = {
          role: 'assistant',
          content: '',
          createdAt: Date.now()
        };
        
        messages.push(assistantMessage);
        renderMessages();
        
        let buffer = '';
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';
          
          for (const line of lines) {
            if (!line.trim()) continue;
            
            let jsonStr = '';
            if (line.startsWith('data: ')) {
              jsonStr = line.slice(6).trim();
            } else if (line.startsWith('{')) {
              jsonStr = line.trim();
            }
            
            if (jsonStr && jsonStr !== '[DONE]') {
              try {
                const parsed = JSON.parse(jsonStr);
                if (parsed?.type === 'text-delta' && parsed.delta) {
                  assistantMessage.content += parsed.delta;
                  updateAssistantMessage(assistantMessage.content);
                }
              } catch (e) {}
            }
          }
        }
        
        if (buffer.trim()) {
          const jsonStr = buffer.trim().startsWith('data: ') 
            ? buffer.trim().slice(6).trim()
            : buffer.trim().startsWith('{') 
              ? buffer.trim() 
              : '';
          
          if (jsonStr && jsonStr !== '[DONE]') {
            try {
              const parsed = JSON.parse(jsonStr);
              if (parsed?.type === 'text-delta' && parsed.delta) {
                assistantMessage.content += parsed.delta;
                updateAssistantMessage(assistantMessage.content);
              }
            } catch (e) {}
          }
        }
        
        isLoading = false;
        currentAssistantBubble = null;
        currentAssistantMessageEl = null;
        renderMessages();
      } catch (error) {
        isLoading = false;
        errorEl.textContent = 'Não foi possível enviar sua mensagem.';
        renderMessages();
      }
    };
    
    button.addEventListener('click', () => {
      isOpen = !isOpen;
      popover.classList.toggle('open', isOpen);
    });
    
    shadow.getElementById('homio-widget-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const input = shadow.getElementById('homio-widget-input');
      const text = input.value.trim();
      if (text) {
        sendMessage(text);
        input.value = '';
      }
    });
    
    renderMessages();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidget);
  } else {
    createWidget();
  }
})();