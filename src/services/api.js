const BASE_URL = 'http://localhost:8082'

export const api = {
  register: async ({ userId, password, confirmPassword, username }) => {
    const response = await fetch(`${BASE_URL}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        password,
        confirmPassword,
        username,
      }),
    })

    let data = null

    try {
      data = await response.json()
    } catch (error) {
      data = null
    }

    if (!response.ok) {
      throw new Error(data?.message || '회원가입에 실패했습니다.')
    }

    return data
  },

  login: async ({ userId, password }) => {
    const response = await fetch(`${BASE_URL}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        password,
      }),
    })

    let data = null

    try {
      data = await response.json()
    } catch (error) {
      data = null
    }

    if (!response.ok) {
      throw new Error(data?.message || '로그인에 실패했습니다.')
    }

    return data
  },
}