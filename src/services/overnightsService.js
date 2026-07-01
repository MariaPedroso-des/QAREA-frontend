const getErrorMessage = async (response, defaultMessage) => {
  try {
    const data = await response.json()
    return data.message ||data.error || defaultMessage
  } catch {
    return defaultMessage
  }
}

export const getAllOvernights = async (urlAPI) => {
  const response = await fetch(`${urlAPI}/api/overnights`)

  if (!response.ok) {
    const message = await getErrorMessage(response, 'No se han podido cargar las zonas de pernocta')
    throw new Error(message)
  }

  const data = await response.json()
  return data.overnights || []
}

export const getOvernightById = async (urlAPI, id) => {
  const response = await fetch(`${urlAPI}/api/overnights/${id}`)

  if(!response.ok) {
    const message = await getErrorMessage(response, 'No se ha podido cargar la zona de pernocta')
    throw new Error(message)
  }

  return await response.json()
}

export const createOvernight = async (urlAPI, payload) => {
  const response = await fetch(`${urlAPI}/api/overnights`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  })

  if(!response.ok) {
    const message = await getErrorMessage(response, 'Error al intentar cargar la zona de pernocta')
    throw new Error(message)
  }

  return await response.json()
}

export const updateOvernight = async (urlAPI, id, payload) => {
  const response = await fetch(`${urlAPI}/api/overnights/edit/${id}`, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(payload)
  })

  if(!response.ok) {
    const message = await getErrorMessage(response, 'Error al intentar editar la zona de pernocta')
    throw new Error(message)
  }

  return await response.json()
}

export const deleteOvernight = async (urlAPI, id) => {
  const response = await fetch(`${urlAPI}/api/overnights/${id}`, {
    method: 'DELETE',
  })

  if(!response.ok) {
    const message = await getErrorMessage(message, 'Error al intentar eliminar la zona de pernocta')
    throw new Error(message)
  }

  return await response.json()
}