const callApi = async (path: string, values: object) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${path}`, {
    method: 'POST',
    body: JSON.stringify(values),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  const json = await response.json()

  return json
}

export default callApi
