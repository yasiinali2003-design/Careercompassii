/**
 * Anti-scraping verification endpoint
 * Validates client-side challenges
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Store valid tokens temporarily (in production, use Redis)
const validTokens = new Map<string, { expires: number; verified: boolean }>();

// Clean up expired tokens every 5 minutes
setInterval(() => {
  const now = Date.now();
  const tokensToDelete: string[] = [];
  validTokens.forEach((data, token) => {
    if (data.expires < now) {
      tokensToDelete.push(token);
    }
  });
  tokensToDelete.forEach(token => validTokens.delete(token));
}, 5 * 60 * 1000);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, challenge } = body;
    
    // Verify token exists and is valid
    const tokenData = validTokens.get(token);
    if (!tokenData || tokenData.expires < Date.now()) {
      return NextResponse.json(
        { success: false, error: 'Virheellinen tai vanhentunut tunnus' },
        { status: 403 }
      );
    }
    
    // Simple challenge: check if client can execute JavaScript
    // In production, use more sophisticated CAPTCHA
    if (challenge === 'js-enabled') {
      validTokens.set(token, { ...tokenData, verified: true });
      
      // Set verification cookie
      const response = NextResponse.json({ success: true });
      response.cookies.set('scraping_verified', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60, // 1 hour
        path: '/'
      });
      
      return response;
    }
    
    return NextResponse.json(
      { success: false, error: 'Virheellinen haaste' },
      { status: 403 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Virheellinen pyyntö' },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Generate challenge token
  const token = crypto.randomBytes(16).toString('hex');
  const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  validTokens.set(token, { expires, verified: false });
  
  return NextResponse.json({
    token,
    challenge: 'js-enabled', // Simple JS verification
    expires: expires
  });
}

