async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  const text = await response.text()

  if (!response.ok) {
    if (response.status === 500) {
      throw new Error('입력값을 다시 확인해주세요.')
    }

    throw new Error(text || '요청 처리 중 오류가 발생했습니다.')
  }

  return text
}

export const api = {
  register: async ({ userId, password, confirmPassword, username }) => {
    return request('/api/users/register', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        password,
        confirmPassword,
        username,
      }),
    })
  },

  login: async ({ userId, password }) => {
    return request('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        password,
      }),
    })
  },
}