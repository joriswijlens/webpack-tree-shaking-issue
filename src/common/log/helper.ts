// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !! TODO: The functionality of this helper can be replaced for a serializer (check cartOrderSerializer)             !!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

const reduceSingleCartEntry = (e: any) => ({
  entryNumber: e.entryNumber,
  quantity: e.quantity,
  price: e.totalPrice?.value,
  code: e.product?.code,
  name: e.product?.name,
  deliveryPointOfService: { name: e.deliveryPointOfService?.name }
})

export const reduceCartEntries = (entries: any[]) => {
  return (entries && entries.length > 0 && entries.map((e: any) => reduceSingleCartEntry(e))) || []
}

export const reduceVirtualProductEntriesResponse = (response: any) => {
  return (response && Object.values(response).map((e: any) => reduceSingleCartEntry(e))) || []
}
