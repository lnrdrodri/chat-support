export function formatChatDate(
  dateString: string | null,
  timeZone = "America/Sao_Paulo"
): string {
  if (!dateString) return "";

  const date = new Date(dateString);

  const now = new Date();

  const getYMD = (d: Date) =>
    new Intl.DateTimeFormat("pt-BR", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .format(d)
      .split("/")
      .map(Number);

  const [d1, m1, y1] = getYMD(date);
  const [d2, m2, y2] = getYMD(now);

  const isToday = y1 === y2 && m1 === m2 && d1 === d2;

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const [y3, m3, d3] = getYMD(yesterday);
  const isYesterday = y1 === y3 && m1 === m3 && d1 === d3;

  if (isToday) {
    return new Intl.DateTimeFormat("pt-BR", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  }

  if (isYesterday) {
    return "Yesterday";
  }

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  if (date >= startOfWeek && date <= endOfWeek) {
    return new Intl.DateTimeFormat("en-US", {
      timeZone,
      weekday: "short",
    }).format(date);
  }

  return new Intl.DateTimeFormat("pt-BR", {
    timeZone,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function formatChatTime(dateString: string | null): string {
  if (!dateString) return "";
  const date = new Date(dateString);

  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatMessage(
  message: string,
  user: string,
  type: string,
  userLoggedIn: string
): string {
  const prefixes = {
    bot_user: "AI Bot: ",
    [userLoggedIn]: "You: ",
  };

  const userPrefix = prefixes[user] || "";

  switch (type) {
    case "text":
      return userPrefix + message;
    case "audio":
      return userPrefix + "🎙️ Audio";
    case "image":
      return userPrefix + "🖼️ Image";
    default:
      return userPrefix + type;
  }
}
