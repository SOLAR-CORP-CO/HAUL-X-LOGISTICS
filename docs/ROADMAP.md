# HAUL X development roadmap

## Stage 1 — Foundation
- [x] Monorepo layout for web, admin, mobile and API
- [x] Brand starter screens
- [x] Initial database schema sketch
- [ ] Connect deployments and environment secrets

## Stage 2 — Identity and data
- [ ] Supabase project and migrations
- [ ] Customer sign-up/sign-in
- [ ] Admin/operator roles enforced server-side
- [ ] Persistent shipment requests

## Stage 3 — Shipment lifecycle
- [ ] Quote review and approval
- [ ] Invoice generation
- [ ] UPI instructions after quote confirmation
- [ ] Pay Later request and manual approval
- [ ] Manual payment verification

## Stage 4 — Operations and tracking
- [ ] Shipment assignment
- [ ] Status and tracking events
- [ ] Customer shipment timeline
- [ ] Documents and support requests

## Stage 5 — Mobile and launch
- [ ] Expo customer app
- [ ] Push notifications
- [ ] Security, privacy and backup review
- [ ] Pilot testing before public launch

## Product rules
- Do not claim live tracking until events are genuinely connected.
- Do not mark a payment paid without manual verification or a verified payment provider.
- Pay Later is a request subject to approval, not a credit promise.
- Keep secrets in hosting environment variables, never in Git.
