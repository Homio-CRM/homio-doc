'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload, Loader2, CheckCircle, AlertCircle, MessageSquarePlus, FileText, Trash2 } from 'lucide-react';
import { cn } from 'fumadocs-ui/utils/cn';

const GHL_MODULES = [
  'Launchpad',
  'Dashboard',
  'Conversas',
  'Calendários',
  'Contatos',
  'Oportunidades',
  'Pagamentos',
  'Marketing',
  'Automação',
  'Sites',
  'Membros',
  'Reputação',
  'Relatórios',
  'App Marketplace',
  'Configurações',
  'Outro'
];

export function SupportDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [fileName, setFileName] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    description: '',
    module: '',
  });

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleRemoveFile = () => {
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('phone', formData.phone);
      data.append('description', formData.description);
      data.append('module', formData.module);
      
      if (fileInputRef.current?.files?.[0]) {
        data.append('attachment', fileInputRef.current.files[0]);
      }

      const response = await fetch('/api/support', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || result.error || 'Failed to submit');
      }

      setSubmitStatus('success');
      setTimeout(() => {
        setIsOpen(false);
        setSubmitStatus('idle');
        setFormData({ name: '', phone: '', description: '', module: '' });
        setFileName(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }, 3000);

    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="text-neutral-700 text-base md:text-lg hover:text-neutral-900 transition-colors"
      >
        Suporte
      </button>
    );
  }

  if (!mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6" style={{ position: 'fixed' }}>
      <div 
        className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm transition-all duration-300" 
        onClick={() => setIsOpen(false)}
      />
      
      <div 
        ref={dialogRef}
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-white/50 overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-gradient-to-r from-neutral-50 to-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
              <MessageSquarePlus className="size-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900 leading-tight">Solicitar Suporte</h2>
              <p className="text-xs text-neutral-500">Preencha os dados para nos ajudar</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-400 hover:text-neutral-600"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <form id="support-form" onSubmit={handleSubmit} className="p-6 space-y-5">
            {submitStatus === 'success' ? (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 animate-in fade-in duration-500">
                <div className="size-16 rounded-full bg-green-50 flex items-center justify-center border border-green-100 shadow-sm">
                  <CheckCircle className="size-8 text-green-600" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-neutral-900">Solicitação Enviada!</h3>
                  <p className="text-neutral-500 max-w-xs mx-auto">Recebemos sua mensagem e entraremos em contato em breve.</p>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide ml-1">Nome</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-neutral-400 text-sm"
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide ml-1">Telefone</label>
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-neutral-400 text-sm"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide ml-1">Módulo</label>
                  <div className="relative">
                    <select
                      required
                      value={formData.module}
                      onChange={e => setFormData({...formData, module: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none text-sm text-neutral-700 cursor-pointer"
                    >
                      <option value="" disabled>Selecione o módulo relacionado</option>
                      {GHL_MODULES.map(mod => (
                        <option key={mod} value={mod}>{mod}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide ml-1">Descrição</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none placeholder:text-neutral-400 text-sm leading-relaxed"
                    placeholder="Descreva detalhadamente o problema ou sua dúvida..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide ml-1">Anexo (Opcional)</label>
                  <div className="relative">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    {!fileName ? (
                      <label 
                        htmlFor="file-upload"
                        className="flex flex-col items-center justify-center w-full px-4 py-6 border-2 border-dashed border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50 hover:border-blue-300/50 transition-all group bg-neutral-50/30"
                      >
                        <div className="size-10 rounded-full bg-neutral-100 flex items-center justify-center mb-2 group-hover:bg-white group-hover:shadow-sm transition-all">
                          <Upload className="size-5 text-neutral-400 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <p className="text-sm text-neutral-600 font-medium group-hover:text-neutral-900">
                          Clique para fazer upload
                        </p>
                        <p className="text-xs text-neutral-400 mt-1">
                          Imagens ou documentos (max. 10MB)
                        </p>
                      </label>
                    ) : (
                      <div className="flex items-center justify-between p-3 bg-blue-50/50 border border-blue-100 rounded-xl group">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="size-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                            <FileText className="size-5 text-blue-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-neutral-900 truncate">{fileName}</p>
                            <p className="text-xs text-blue-600">Pronto para envio</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="p-2 hover:bg-white rounded-lg text-neutral-400 hover:text-red-500 hover:shadow-sm transition-all"
                          title="Remover arquivo"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {submitStatus === 'error' && (
                  <div className="flex items-center gap-3 text-red-600 text-sm bg-red-50 p-4 rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="size-5 shrink-0" />
                    <span>Não foi possível enviar sua solicitação. Verifique sua conexão e tente novamente.</span>
                  </div>
                )}
              </>
            )}
          </form>
        </div>

        {/* Footer */}
        {submitStatus !== 'success' && (
          <div className="p-6 border-t border-neutral-100 bg-neutral-50/50 shrink-0">
            <button
              type="submit"
              form="support-form"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Enviando solicitação...
                </>
              ) : (
                <>
                  Enviar Solicitação
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
