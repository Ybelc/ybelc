export const CHAT_COPY = {
	welcome:
		"👋 Olá! Seja bem-vindo à Ybelc.\n\nComo podemos ajudar você hoje? Envie sua dúvida, sugestão ou solicitação abaixo.",
	requestEmail:
		"Obrigado pela sua mensagem! 😊\n\nPara que possamos responder corretamente, informe por favor o seu e-mail de contato.",
	confirmation:
		"Perfeito! ✅\n\nRecebemos sua solicitação e nosso time entrará em contato em breve através do e-mail informado.\n\n🙏 Obrigado por entrar em contato com a Ybelc.",
	invalidEmail:
		"⚠️ O e-mail informado parece inválido.\n\nPor favor, digite um e-mail válido (exemplo: nome@empresa.com).",
	submitError:
		"Não foi possível enviar sua mensagem no momento. Por favor, tente novamente em instantes.",
} as const;

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
	const trimmed = value.trim();
	return trimmed.length > 0 && EMAIL_REGEX.test(trimmed);
}
