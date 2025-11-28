# Widget Liv - Assistente de Documentação Homio

Este documento explica como embedar o assistente de IA Liv em qualquer página web usando um iframe.

## 📋 Visão Geral

O widget Liv é um assistente de IA especializado na documentação da plataforma Homio. Ele pode ser facilmente integrado em qualquer página web através de um iframe.

## 🚀 Como Usar

### Opção 1: Iframe Básico

Adicione o seguinte código HTML na sua página:

```html
<iframe 
  src="https://seu-dominio.com/widget" 
  width="100%" 
  height="600" 
  frameborder="0" 
  allowtransparency="true"
  style="border: none; background: transparent;"
></iframe>
```

### Opção 2: Iframe Flutuante (Recomendado)

Para um widget flutuante no canto da página, use este código:

```html
<iframe 
  id="liv-widget"
  src="https://seu-dominio.com/widget" 
  width="100%" 
  height="100%" 
  frameborder="0" 
  allowtransparency="true"
  style="
    position: fixed;
    bottom: 0;
    right: 0;
    width: 400px;
    height: 600px;
    max-width: 100vw;
    max-height: 100vh;
    border: none;
    background: transparent;
    z-index: 9999;
    pointer-events: auto;
  "
></iframe>
```

### Opção 3: Iframe Responsivo com Media Queries

Para melhor experiência em dispositivos móveis:

```html
<style>
  .liv-widget-container {
    position: fixed;
    bottom: 0;
    right: 0;
    width: 400px;
    height: 600px;
    max-width: 100vw;
    max-height: 100vh;
    z-index: 9999;
  }

  @media (max-width: 768px) {
    .liv-widget-container {
      width: 100vw;
      height: 100vh;
      top: 0;
      left: 0;
    }
  }
</style>

<iframe 
  class="liv-widget-container"
  src="https://seu-dominio.com/widget" 
  frameborder="0" 
  allowtransparency="true"
  style="border: none; background: transparent;"
></iframe>
```

## ⚙️ Configurações Avançadas

### Permitir Comunicação entre Iframe e Página Pai

Se você precisar de comunicação entre o widget e a página pai, adicione o atributo `sandbox`:

```html
<iframe 
  src="https://seu-dominio.com/widget" 
  sandbox="allow-scripts allow-same-origin allow-forms"
  width="100%" 
  height="600" 
  frameborder="0"
></iframe>
```

### Controle de Exibição com JavaScript

Para mostrar/ocultar o widget dinamicamente:

```html
<button onclick="toggleWidget()">Abrir/Fechar Liv</button>

<iframe 
  id="liv-widget"
  src="https://seu-dominio.com/widget" 
  style="
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 400px;
    height: 600px;
    border: none;
    background: transparent;
    z-index: 9999;
    display: none;
  "
></iframe>

<script>
  function toggleWidget() {
    const widget = document.getElementById('liv-widget');
    widget.style.display = widget.style.display === 'none' ? 'block' : 'none';
  }
</script>
```

## 🎨 Personalização

### Ajustar Tamanho do Widget

O widget se adapta automaticamente ao tamanho do iframe. Ajuste as dimensões conforme necessário:

```html
<iframe 
  src="https://seu-dominio.com/widget" 
  width="480" 
  height="600" 
  frameborder="0"
></iframe>
```

### Posicionamento Customizado

Use CSS para posicionar o widget onde desejar:

```html
<style>
  #liv-widget {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 480px;
    height: 600px;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  }
</style>

<iframe 
  id="liv-widget"
  src="https://seu-dominio.com/widget" 
  frameborder="0"
></iframe>
```

## 📱 Exemplo Completo para WordPress

Se você estiver usando WordPress, adicione este código no widget HTML personalizado ou no editor de blocos:

```html
<div style="position: fixed; bottom: 20px; right: 20px; z-index: 9999;">
  <iframe 
    src="https://seu-dominio.com/widget" 
    width="400" 
    height="600" 
    frameborder="0" 
    allowtransparency="true"
    style="border: none; border-radius: 16px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);"
  ></iframe>
</div>
```

## 🔒 Segurança e CORS

O widget funciona dentro de um iframe e faz requisições para a API do seu domínio. Certifique-se de que:

1. O domínio do widget está configurado corretamente
2. As políticas CORS estão configuradas se necessário
3. O iframe tem as permissões adequadas (`sandbox` se necessário)

## 📝 Notas Importantes

- **URL do Widget**: Substitua `https://seu-dominio.com/widget` pela URL real do seu widget
- **Responsividade**: O widget é totalmente responsivo e se adapta ao tamanho do iframe
- **Performance**: O widget carrega apenas quando necessário e não afeta o desempenho da página principal
- **Acessibilidade**: O widget inclui suporte completo a leitores de tela e navegação por teclado

## 🐛 Solução de Problemas

### Widget não aparece

- Verifique se a URL está correta
- Confirme que o iframe não está bloqueado por políticas de segurança
- Verifique o console do navegador para erros

### Widget não responde

- Verifique a conexão com a API
- Confirme que as requisições não estão sendo bloqueadas por CORS
- Verifique os logs do servidor

### Problemas de estilo

- Certifique-se de que `allowtransparency="true"` está definido
- Verifique se não há conflitos de CSS com a página pai
- Use `!important` apenas se necessário para sobrescrever estilos

## 📞 Suporte

Para mais informações ou suporte, entre em contato com a equipe de desenvolvimento.

