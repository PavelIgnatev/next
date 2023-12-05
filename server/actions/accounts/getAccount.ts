'use server'
 
import { cookies } from 'next/headers'
 
export async function delete2() {
  cookies().delete('name')
  // ...
}