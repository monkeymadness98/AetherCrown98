# Incident Response Runbook

**AetherCrown98 Incident Response**  
**Quick Reference Guide**

---

## 🚨 EMERGENCY CONTACTS

| Role | Name | Phone | Email |
|------|------|-------|-------|
| On-Call Engineer | [Name] | [Phone] | [Email] |
| CTO | [Name] | [Phone] | [Email] |
| CEO | Amin | [Phone] | [Email] |
| DevOps Lead | [Name] | [Phone] | [Email] |

**Emergency Hotline:** [Phone Number]  
**Incident Slack Channel:** #incidents

---

## SEVERITY LEVELS

**P0 - Critical:** Complete outage, revenue impact  
**P1 - High:** Major functionality broken  
**P2 - Medium:** Minor feature issue  
**P3 - Low:** Cosmetic, no user impact

---

## QUICK RESPONSE CHECKLIST

### Immediate (First 5 Minutes)
- [ ] Acknowledge incident in Slack #incidents
- [ ] Assess severity (P0-P3)
- [ ] Check monitoring dashboards
- [ ] Review recent deployments

### Investigation (Next 10 Minutes)
- [ ] Check service logs
- [ ] Review error rates in Sentry
- [ ] Test core functionality
- [ ] Identify root cause

### Resolution
- [ ] Implement fix or rollback
- [ ] Verify fix in production
- [ ] Monitor for stability
- [ ] Update incident channel

### Post-Incident
- [ ] Write post-mortem
- [ ] Update runbook
- [ ] Schedule team review

---

## COMMON INCIDENTS

### 1. Service Down
**Symptoms:** 502/503 errors, health check fails

**Quick Checks:**
```bash
curl -I https://aethercrown98-backend.onrender.com/healthz
curl -I https://aethercrown98.vercel.app
```

**Resolution:**
1. Check Render/Vercel status pages
2. Review deployment logs
3. Rollback last deployment if needed
4. Restart service if hung

---

### 2. Database Connection Issues
**Symptoms:** Timeout errors, connection pool exhausted

**Quick Checks:**
```bash
psql -h [HOST] -U postgres -d postgres -c "SELECT 1;"
```

**Resolution:**
1. Check Supabase dashboard
2. Review connection pool settings
3. Kill long-running queries
4. Scale database if needed

---

### 3. Payment Processing Failed
**Symptoms:** Payment errors, webhook failures

**Quick Checks:**
- Check Stripe/PayPal dashboards
- Review payment logs
- Test payment flow manually

**Resolution:**
1. Verify API keys are valid
2. Check webhook endpoints
3. Review error logs
4. Contact payment provider support

---

For detailed procedures, see `/monitoring/alert.md`
