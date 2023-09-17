interface IPhones {
  number: string
}

interface IContact {
  id: number
  first_name: string
  last_name: string
  phones: IPhones[]
  created_at: string
}
