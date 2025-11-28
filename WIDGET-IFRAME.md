# Widget Liv - Assistente de Documentação Homio

Este documento explica como embedar o assistente de IA Liv em qualquer página web usando um iframe.

## 📋 Visão Geral

O widget Liv é um assistente de IA especializado na documentação da plataforma Homio. Ele pode ser facilmente integrado em qualquer página web através de um iframe.

## 🚀 Como Usar

### Iframe Responsivo Flutuante

Widget flutuante totalmente responsivo que se adapta a todos os tamanhos de tela:

```html
<style>
  .liv-widget {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 500px;
    height: 700px;
    border: none;
    background: transparent;
    z-index: 9999;
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    .liv-widget {
      width: calc(100vw - 20px);
      height: calc(100vh - 20px);
      bottom: 10px;
      right: 10px;
      left: 10px;
    }
  }

  @media (max-width: 480px) {
    .liv-widget {
      width: 100vw;
      height: 100vh;
      bottom: 0;
      right: 0;
      left: 0;
      top: 0;
      border-radius: 0;
      box-shadow: none;
    }
  }
</style>

<iframe 
  class="liv-widget"
  src="https://seu-dominio.com/widget" 
  frameborder="0" 
  allowtransparency="true"
></iframe>
```

**Versão inline (sem CSS separado):**

```html
<iframe 
  src="https://seu-dominio.com/widget" 
  frameborder="0" 
  allowtransparency="true"
  style="
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 500px;
    height: 700px;
    border: none;
    background: transparent;
    z-index: 9999;
    border-radius: 16px;
  "
></iframe>
```

## 🔒 Segurança e CORS

O widget funciona dentro de um iframe e faz requisições para a API do seu domínio. Certifique-se de que:

1. O domínio do widget está configurado corretamente
2. As políticas CORS estão configuradas se necessário
3. O iframe tem as permissões adequadas (`sandbox` se necessário)

## 📝 Notas Importantes

- **URL do Widget**: Substitua `https://seu-dominio.com/widget` pela URL real do seu widget
- **Responsividade**: O widget é totalmente responsivo e se adapta ao tamanho do iframe automaticamente
- **Performance**: O widget carrega apenas quando necessário e não afeta o desempenho da página principal
- **Acessibilidade**: O widget inclui suporte completo a leitores de tela e navegação por teclado
- **Viewport**: Use `max-width: calc(100vw - Xpx)` e `max-height: calc(100vh - Xpx)` para garantir que o widget nunca ultrapasse os limites da tela

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

