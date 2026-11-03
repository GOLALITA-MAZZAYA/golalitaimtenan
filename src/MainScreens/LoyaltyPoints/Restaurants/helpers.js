export const canCancelAppointment = (status) => {
  return status !== 'cancelled'
}

export const canReBookAppointment = (status) => {
  return status !== 'cancelled'
}

export const canCancelOrder = (type,status) => {
  return status === 'new' && type === 'delivery'
}

export const canReOrder = (type,status) => {
  return status === 'new' && type === 'delivery'
}

