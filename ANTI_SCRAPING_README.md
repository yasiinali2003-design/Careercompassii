# Anti-Scraping Protection System

Comprehensive multi-layer protection against web scraping and bot attacks.

## Protection Layers

### 1. **Bot Detection** (`lib/antiScraping.ts`)
- User-Agent analysis
- Missing browser headers detection
- Suspicious referer patterns
- Automation tool detection
- Request fingerprinting

### 2. **Behavioral Analysis** (`lib/botDetection.ts`)
- Request pattern tracking
- Frequency analysis
- Repetitive pattern detection
- Confidence scoring (0-100)
- Action determination (allow/challenge/block)

### 3. **Middleware Protection** (`middleware.ts`)
- Real-time bot blocking
- Suspicious request tracking
- Challenge redirects
- Security headers injection

### 4. **Rate Limiting** (`lib/rateLimit.ts`)
- Per-IP request limits
- Hourly and daily thresholds
- GDPR-compliant IP hashing
- Automatic cleanup

### 5. **Challenge System** (`app/challenge/page.tsx`)
- JavaScript verification
- Token-based validation
- Cookie-based verification
- Automatic redirect after verification

### 6. **Robots.txt** (`public/robots.txt`)
- Blocks known scrapers
- Allows search engines (SEO)
- Explicit crawler blocking
- Crawl delay enforcement

### 7. **Security Headers**
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin
- Content-Security-Policy: strict CSP
- Cache-Control for sensitive pages

## Configuration

### Environment Variables
```env
RATE_LIMIT_SALT=your-secret-salt-here
NODE_ENV=production
```

### Rate Limits
- **Normal users**: 30 req/min, 200 req/hour, 1000 req/day
- **Suspicious**: 5 req/min, 20 req/hour, 100 req/day

### Bot Detection Thresholds
- **Block**: Confidence ≥ 80%
- **Challenge**: Confidence ≥ 50%
- **Allow**: Confidence < 50%

## Blocked User Agents

The system blocks:
- Automation tools (curl, wget, python-requests, scrapy, selenium)
- Known scrapers (SemrushBot, AhrefsBot, MJ12bot, etc.)
- Headless browsers
- Missing or suspicious user agents

## Allowed User Agents

The system allows:
- Googlebot (for SEO)
- Bingbot (for SEO)
- Other legitimate search engines

## How It Works

1. **Request arrives** → Middleware intercepts
2. **User-Agent check** → Immediate block if known bot
3. **Pattern analysis** → Check for suspicious behavior
4. **Rate limit check** → Verify request frequency
5. **Challenge if needed** → Redirect to verification page
6. **Security headers** → Add protection headers
7. **Request proceeds** → If all checks pass

## Monitoring

All suspicious requests are logged to the `rate_limits` table with:
- Hashed IP address
- Request fingerprint
- User agent hash
- Pathname
- Suspicious flags
- Timestamp

## Legal Protection

The system is backed by legal documents:
- **Käyttöehdot**: Prohibits scraping
- **Immateriaalioikeus**: Protects intellectual property
- **Tietosuojaseloste**: GDPR compliance

## Testing

To test the protection:
1. Try accessing with curl: `curl https://urakompassi.com` → Should be blocked
2. Try rapid requests → Should trigger rate limiting
3. Try without user-agent → Should be blocked
4. Normal browser → Should work fine

## Maintenance

- Clean up old rate limit records (runs automatically)
- Update bot user agent list as needed
- Monitor false positives and adjust thresholds
- Review blocked IPs periodically

## Future Enhancements

- CAPTCHA integration (reCAPTCHA, hCaptcha)
- IP reputation checking (AbuseIPDB, etc.)
- Machine learning-based detection
- Honeypot fields in forms
- Content obfuscation
- Dynamic class names
- Token-based API access

