# SerbisYO Project Context

## 1. Refined System Description

**SerbisYO** is a community-powered service intelligence, discovery, and transparency platform designed to help people make better decisions when choosing establishments, businesses, organizations, public offices, institutions, and public-facing individual service providers. Through a map-based interface, users can search for nearby services and view practical information beyond ordinary ratings, including actual waiting and processing times, operating hours, service availability, peak hours, reliability, responsiveness, information accuracy, accessibility, service quality, and overall community experience.

The main purpose of SerbisYO is to reduce uncertainty before people use a service by helping them understand **where to go, when to go, what to expect, and which option is more reliable**. Users can contribute their own experiences, updates, estimates, and feedback, allowing the platform's community-based information to improve over time. This can help reduce wasted trips, unexpected delays, outdated or inaccurate information, and poor service experiences.

At the same time, SerbisYO encourages service providers to become more transparent, responsible, consistent, and accountable by making actual service performance and public experience more visible. Reputation is one output of the platform, but the larger goal is to turn shared community experiences into practical service intelligence that helps people make smarter decisions and encourages better service for everyone.

## 2. Overall Vision

> **Make service information more transparent, useful, measurable, and community-driven so people can make better decisions while service providers are encouraged to deliver better and more accountable service.**

Short internal description:

> **SerbisYO helps people know where to go, when to go, what to expect, and which service they can rely on.**

## 3. The Problem

- People can usually find **where** a service is located, but not necessarily what the actual service experience will be.
- Ordinary star ratings do not clearly explain waiting time, processing time, reliability, availability, accessibility, or information accuracy.
- Posted schedules, requirements, operating hours, availability, and processing estimates can be outdated or different from actual conditions.
- Users can waste time, transportation expenses, and effort by arriving at a service that is unavailable, overcrowded, delayed, closed, or different from what they expected.
- Useful service experiences are scattered across social media posts, comments, reviews, group chats, or word of mouth instead of being converted into structured information.
- Service providers often lack a simple public-facing view of recurring service issues and how people actually experience their service.

## 4. What Makes SerbisYO Different

SerbisYO should not be presented as only a ratings platform or a queue tracker.

Its differentiator is the conversion of **community experience into structured service intelligence**.

Examples of useful information:

- Average waiting time
- Typical processing/service time
- Common peak hours
- Service availability
- Reliability/consistency
- Information accuracy
- Accessibility
- Service quality
- Recent community updates
- Confidence level based on the amount and recency of community data

The user should be able to make a decision, not merely read opinions.

## 5. Core Product Questions

Every major feature should help answer at least one of these:

- **Where should I go?**
- **When should I go?**
- **What should I expect?**
- **Which provider is more reliable?**
- **Is the available information still accurate?**
- **How can my experience help the next person?**

## 6. Main User Types

### Service User / Community Member

Searches for services, checks service intelligence, compares options, views recent experiences, and contributes an experience after using a service.

### Service Provider / Organization

Represents a business, institution, office, organization, or public-facing professional. In future versions, verified providers may claim profiles, correct official details, respond to feedback, and view service insights.

### Moderator / Administrator

Reviews reports, corrections, abusive submissions, obviously invalid data, and other community moderation concerns.

## 7. Service Provider Scope

SerbisYO may include:

- Businesses and commercial establishments
- Government/public offices
- Institutions and organizations
- Clinics and other service centers
- Educational or community service facilities
- Public-facing individual professionals or service providers

Avoid creating reputation profiles for arbitrary private individuals. Individual profiles should relate to legitimate public-facing or professional services.

## 8. Product Principles

- **Useful before impressive:** every feature should improve a real service decision.
- **Structured data over vague opinion:** collect information that can be aggregated and compared.
- **Community-powered, not community-chaotic:** contributions need moderation, context, recency, and confidence indicators.
- **Accountability without public shaming:** make service performance visible while supporting corrections and fair responses.
- **Time matters, but SerbisYO is broader than time:** waiting time is a major dimension, not the entire product.
- **Responsive by default:** the core experience must work properly on desktop and mobile.
- **MVP discipline:** do not expand the scope when the main experience is incomplete.

## 9. SDG Alignment

Primary alignment:

- **SDG 11 - Sustainable Cities and Communities**
- **SDG 16 - Peace, Justice and Strong Institutions**

Supporting alignment:

- **SDG 10 - Reduced Inequalities**
- **SDG 9 - Industry, Innovation and Infrastructure**
- **SDG 8 - Decent Work and Economic Growth**

## 10. Working Terminology

- **Service Provider** - establishment, organization, institution, office, business, or public-facing individual professional.
- **Service Profile** - the detailed SerbisYO page for a service provider/location.
- **Community Contribution / Experience** - structured information submitted by a user after using or visiting a service.
- **Service Intelligence** - aggregated practical information derived from official details and community experience.
- **SerbisYO Score** - prototype-level composite score summarizing selected service dimensions.
- **Community Confidence** - indication of how much confidence should be placed in aggregated data based on contribution count, recency, and/or consistency.

## 11. Product Experience Direction

SerbisYO should feel like a **modern spatial service app** rather than a traditional school-system dashboard. The map is the main working canvas, while service information appears through layered cards, side sheets, bottom sheets, compact filters, and contextual actions.

The product experience should preserve one consistent mental model across devices:

> **Find a service -> focus the place on the map -> reveal service intelligence -> make a decision -> contribute an experience -> help the next person.**

Desktop and mobile should not feel like separate products. The same information hierarchy should morph between layouts:

- **Desktop:** results/service panel + dominant map + contextual detail sheet.
- **Mobile:** full map canvas + floating search/filter controls + draggable bottom sheet + compact bottom navigation.

The visual direction is inspired by modern travel, mapping, local discovery, and spatial utility interfaces, but SerbisYO must not directly imitate any reference product. Its own identity should come from service intelligence, community confidence, time/reliability metrics, and the relationship between service cards and map markers.

### Visual Principles

- Map-first, not dashboard-first.
- Soft layered surfaces over a calm map.
- Clear information hierarchy instead of many equal-sized cards.
- Rounded controls and sheets used intentionally, not everywhere.
- Restrained motion that explains state changes and spatial relationships.
- Modern, trustworthy, community-centered tone.
- Strong responsive behavior from narrow mobile screens to wide desktop monitors.
- Accessibility and readability take priority over decoration.

The detailed page-by-page visual direction is maintained in `DESIGN_BLUEPRINT.md`, while concept-image generation prompts are maintained in `UI_IMAGE_PROMPTS.md`.

