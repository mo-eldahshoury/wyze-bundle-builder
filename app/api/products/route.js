import { NextResponse } from 'next/server';
import productsData from '@/data/products.json';

export async function GET() {
  try {
    return NextResponse.json(productsData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products data' },
      { status: 500 }
    );
  }
}