/* =========================================================================
   Casa Guaiamum — configuração única
   -------------------------------------------------------------------------
   Para trocar o número do WhatsApp, altere APENAS whatsappNumber aqui.
   O script aplica o valor a todos os links marcados com data-wa (rodapé e
   botão flutuante) e à mensagem gerada pelo formulário.

   whatsappConfirmed: o destino foi conferido na própria galeria do anúncio
   do anfitrião, numa fotografia com o texto "21 960158360 / wathsapp"
   (arquivo guardado em casa-guaiamum-entrega/evidencia-whatsapp.jpg).
   Nenhuma mensagem de teste foi enviada. Se o número mudar, atualize-o aqui
   e reveja o rodapé, o MANUAL-DO-SITE.md e esta observação.
   ========================================================================= */
window.CASA_GUAIAMUM = {
  whatsappNumber: "5521960158360",   // só dígitos: país + DDD + número
  whatsappConfirmed: true,
  maxHospedes: 12,                   // conforme o anúncio do anfitrião
  minHospedes: 1
};
