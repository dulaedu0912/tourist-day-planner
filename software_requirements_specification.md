# Software Requirements Specification
## for
## Local Tourist Day-Visit Planner

**Version:** 1.1  
**Prepared by:** B.W.D.C Bandara (E2410352)  
**Organization:** ITE2953 - Programming Group Project  
**Date:** 2026-08-18  

---

## Contents
* [Revision History](#revision-history)
* [1. Introduction](#1-introduction)
  * [1.1 Purpose](#11-purpose)
  * [1.2 Document Conventions](#12-document-conventions)
  * [1.3 Intended Audience and Reading Suggestions](#13-intended-audience-and-reading-suggestions)
  * [1.4 Product Scope](#14-product-scope)
  * [1.5 References](#15-references)
* [2. Overall Description](#2-overall-description)
  * [2.1 Product Perspective](#21-product-perspective)
  * [2.2 Product Functions](#22-product-functions)
  * [2.3 User Classes and Characteristics](#23-user-classes-and-characteristics)
  * [2.4 Operating Environment](#24-operating-environment)
  * [2.5 Design and Implementation Constraints](#25-design-and-implementation-constraints)
  * [2.6 User Documentation](#26-user-documentation)
  * [2.7 Assumptions and Dependencies](#27-assumptions-and-dependencies)
* [3. External Interface Requirements](#3-external-interface-requirements)
  * [3.1 User Interfaces](#31-user-interfaces)
  * [3.2 Hardware Interfaces](#32-hardware-interfaces)
  * [3.3 Software Interfaces](#33-software-interfaces)
  * [3.4 Communications Interfaces](#34-communications-interfaces)
* [4. System Features](#4-system-features)
  * [4.1 Place Browsing & Listing](#41-place-browsing--listing)
  * [4.2 Category Filtering & Distance Display](#42-category-filtering--distance-display)
  * [4.3 Place Details View](#43-place-details-view)
  * [4.4 Map View (Location Display)](#44-map-view-location-display)
  * [4.5 One-Day Visit Planner](#45-one-day-visit-planner)
  * [4.6 Admin Authentication & Session Management](#46-admin-authentication--session-management)
  * [4.7 Admin Place Management (CRUD)](#47-admin-place-management-crud)
* [5. Other Nonfunctional Requirements](#5-other-nonfunctional-requirements)
  * [5.1 Performance Requirements](#51-performance-requirements)
  * [5.2 Safety Requirements](#52-safety-requirements)
  * [5.3 Security Requirements](#53-security-requirements)
  * [5.4 Software Quality Attributes](#54-software-quality-attributes)
  * [5.5 Business Rules](#55-business-rules)
* [6. Other Requirements](#6-other-requirements)
* [Appendix A: Initial Seed Places Data](#appendix-a-initial-seed-places-data)
* [Appendix B: Glossary](#appendix-b-glossary)
* [Appendix C: Analysis Models (Textual & Structural)](#appendix-c-analysis-models-textual--structural)
* [Appendix D: To Be Determined (TBD) List](#appendix-d-to-be-determined-tbd-list)

---

## Revision History

| Name | Date | Reason For Changes | Version |
|---|---|---|---|
| B.W.D.C Bandara | August 18, 2026 | Initial baseline document created from approved project proposal. | 1.0 |
| B.W.D.C Bandara | September, 2026 | Addressed peer review feedback: clarified problem statement, fixed FR-008 typo, cleaned references, and refined stakeholder definitions. | 1.1 |

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) defines the functional and nonfunctional requirements for the Local Tourist Day-Visit Planner (hereafter, "the System"), Version 1.1. This SRS covers the full system described in the project proposal: a web-based application that provides categorized attraction information within a 25 km radius of Ganemulla and supports a simple one-day visit planning feature, including an admin panel for place management.

#### 1.1.1 Problem Statement
Tourists visiting regional hubs like Ganemulla lack a consolidated, local-centric platform to discover nearby attractions within short travel radii. Existing global tools (such as generic map services) often highlight major national landmarks while cluttering local views with irrelevant commercial listings, making short day-trip planning inefficient for local visitors.

### 1.2 Document Conventions
* Requirement statements use the keyword **"shall"** (e.g., *"The system shall..."*).
* Requirements are uniquely identified as:
  * **FR-xxx** for Functional Requirements
  * **NFR-xxx** for Nonfunctional Requirements
  * **BR-xxx** for Business Rules
  * **CON-xxx** for Design/Implementation Constraints
* Priority labels:
  * **High** = essential for MVP and acceptance
  * **Medium** = important, but system can operate without it
  * **Low** = desirable enhancements

### 1.3 Intended Audience and Reading Suggestions
#### Intended Audience
* Project supervisor/lecturer (evaluation and scope validation)
* Stakeholders/users (validating expected behavior)
* Developers (frontend/backend implementation)
* Testers (test planning and verification)

#### Reading Suggestions
* Read Section 1–2 for overview and scope.
* Read Section 4 for detailed functional features (developers/testers).
* Read Section 5 for quality constraints (developers/testers).
* Appendices support terminology, initial datasets, and structural models.

### 1.4 Product Scope
The System provides a centralized web platform for tourists visiting Ganemulla and surrounding attractions (within ~25 km) to:
* Browse and filter places by category.
* View structured place information (description, distance, opening times, travel tips).
* View location on an interactive map.
* Create a simple one-day visit plan by selecting places.
* Use an admin panel to add/edit/delete place information.

**Out of Scope (per proposal):**
* Online bookings and payments.
* Hotel/transport reservations.
* Multi-day itinerary planning.

### 1.5 References
1. Karl E. Wiegers, *Software Requirements Specification Template*, Version 1.0, 1999.
2. UNWTO, "Tourism and Digital Transformation," World Tourism Organization, 2022.
3. MongoDB Inc., "MongoDB Atlas Documentation," 2024. [Online]. Available: https://www.mongodb.com/docs/atlas/
4. OpenStreetMap Contributors, "OpenStreetMap API & Leaflet Integration Documentation," 2024. [Online]. Available: https://www.openstreetmap.org/
5. Tailwind CSS Documentation, "Tailwind CSS v3 Framework Guide," 2024. [Online]. Available: https://tailwindcss.com/
6. Node.js Foundation, "Node.js Documentation," 2024.

---

## 2. Overall Description

### 2.1 Product Perspective
The System is a new, standalone web application developed for the Ganemulla area tourism context.

At a high level, it includes:
1. A tourist-facing web UI for browsing places and creating a day plan.
2. An admin UI for managing place records.
3. A backend service and a cloud database system to store places and visit plans.
4. An external open-source map service integration to render interactive spatial data.

```
+------------------+          +------------------+
|   Tourist User   |          |    Admin User    |
+--------+---------+          +--------+---------+
         |                             |
         v                             v
+------------------+          +------------------+
|      Web UI      |          |     Admin UI     |
| (Browse, Filter, |          | (Manage Places,  |
|      Plan)       |          |      CRUD)       |
+--------+---------+          +--------+---------+
         |                             |
         +--------------+--------------+
                        |
                        v
          +---------------------------+          +-------------------------+
          |          System           |<-------->|       Map Service       |
          |  (Backend Business Logic) |          | (OpenStreetMap / Tiles) |
          +-------------+-------------+          +-------------------------+
                        |
                        v
          +---------------------------+
          |         Database          |
          |   (MongoDB Atlas Instance)|
          +---------------------------+
```

### 2.2 Product Functions
At a high level, the System shall provide:
* Place browsing and listing
* Place category filtering
* Place details view (description, opening times, travel tips, distance)
* Map-based location display
* One-day visit planner (select, reorder, remove places; view plan summary)
* Admin login and CRUD management of places

### 2.3 User Classes and Characteristics
* **Tourist User (Primary):** Local tourists, foreign tourists, families, students; may have varied technical skills; uses browsing, filtering, viewing details, and planning features.
* **Admin User (Secondary):** Maintains place data; requires authentication; uses create/update/delete place functions.

### 2.4 Operating Environment
* **Client:** Modern web browsers (latest stable versions of Chrome, Edge, Firefox, Safari) across mobile and desktop.
* **Server:** Web server environment hosting a Node.js backend service.
* **Database:** Cloud-hosted MongoDB Atlas database instance.
* **Network:** Internet connection required for OpenStreetMap tile fetching and accessing the hosted database/API endpoints.

### 2.5 Design and Implementation Constraints
* **CON-01:** The implementation shall use a web-based architecture (browser-accessible).
* **CON-02:** The system shall use standard JavaScript (Vanilla JS or Node/React JS) and **MUST NOT** use TypeScript.
* **CON-03:** The application frontend UI styling shall be implemented using **Tailwind CSS**.
* **CON-04:** The application backend shall interface with **MongoDB Atlas** for database storage.
* **CON-05:** Interactive maps and geographic markers shall be implemented using **OpenStreetMap** (e.g., via Leaflet.js).
* **CON-06:** The system shall not implement payment, booking, hotel reservation, or transport reservation features.
* **CON-07:** Places managed by the System shall be limited to within a 25 km radius of Ganemulla (see BR-001).

### 2.6 User Documentation
The project shall provide:
* A short User Guide (tourist usage).
* An Admin Guide (admin login and place management).

### 2.7 Assumptions and Dependencies
* **A-01:** Accurate place information (opening times, descriptions, tips) will be available for initial data entry.
* **A-02:** Third-party map tile servers (OpenStreetMap) will be accessible and responsive from client environments.
* **A-03:** Although not explicitly requested by stakeholders in the initial consultation, admin authentication is included as a necessary safeguard for data integrity (see BR-002) since the admin panel performs destructive operations (delete) on shared database data.
* **D-01:** Interactive map rendering relies on OpenStreetMap tile server uptime and network connectivity.

---

## 3. External Interface Requirements

### 3.1 User Interfaces
Tourist UI shall include:
* Home / Place listing page styled with Tailwind CSS layout utilities.
* Category filter controls and search controls.
* Place details view modal or page.
* Visit planner drawer/panel.

Admin UI shall include:
* Admin login page.
* Place management dashboard (table list with add/edit modal and deletion prompts).

UI requirements:
* **UI-01:** The UI shall be responsive for mobile and desktop screen sizes using Tailwind CSS responsive classes.
* **UI-02:** The UI shall display error messages in a clear, user-readable manner.
* **UI-03:** Common navigation shall allow returning to place listing from details/planner views.

### 3.2 Hardware Interfaces
No specialized hardware interfaces are required beyond standard client devices (PC/mobile) capable of running a modern web browser.

### 3.3 Software Interfaces
* **SI-01:** The System shall integrate with OpenStreetMap APIs (or Leaflet library) to render map tiles and display interactive place markers.
* **SI-02:** The System shall use a MongoDB Atlas cloud database instance to store place records, application configurations, and admin user credentials.

### 3.4 Communications Interfaces
* **CI-01:** The client and server shall communicate over HTTPS.
* **CI-02:** The backend shall expose a RESTful API for retrieving places and handling admin CRUD operations over HTTPS.
* **CI-03:** The System shall support standard HTTP response status codes for API responses (e.g., 200, 400, 401, 404, 500).

---

## 4. System Features

### 4.1 Place Browsing & Listing
#### 4.1.1 Description and Priority
Allows users to view a list of available attractions. **Priority: High**

#### 4.1.2 Stimulus/Response Sequences
1. User opens the web application $\rightarrow$ System displays the place listing page with available places.
2. User scrolls list $\rightarrow$ System renders place cards styled with Tailwind CSS.

#### 4.1.3 Functional Requirements
* **FR-001:** The system shall display a list of available places to tourist users.
* **FR-002:** Each place card in the list shall show at minimum: place name, category, and calculated/stored distance.
* **FR-003:** The system shall provide a way to open a selected place's details view from the list.
* **FR-004:** The system shall display a clear empty-state message when no places match query criteria or are available.

### 4.2 Category Filtering & Distance Display
#### 4.2.1 Description and Priority
Users filter places by category; system displays distance from a defined reference point in Ganemulla. **Priority: High**

#### 4.2.2 Stimulus/Response Sequences
1. User selects a category filter $\rightarrow$ System filters and displays only places belonging to that category.
2. User clears category filter $\rightarrow$ System displays all places.
3. User views list/details $\rightarrow$ System displays calculated distance in kilometers.

#### 4.2.3 Functional Requirements
* **FR-005:** The system shall allow tourist users to filter places by category.
* **FR-006:** The system shall support at least the categories: *Nature*, *Religious*, *Dining*, *Heritage*, *Recreation*, *Eco-Tourism* (or equivalent categories used in stored database entries).
* **FR-007:** The system shall display an approximate distance (in km) for each place from a defined Ganemulla reference location.
* **FR-008:** The system shall use a fixed reference location (e.g., Ganemulla Railway Station / Town Center) as the origin point for distance metrics.
* **FR-009:** The system shall display "Distance unavailable" if distance cannot be computed due to missing coordinate fields.

### 4.3 Place Details View
#### 4.3.1 Description and Priority
Displays structured details and tips for a selected place. **Priority: High**

#### 4.3.2 Stimulus/Response Sequences
1. User selects a place card $\rightarrow$ System opens the place details view showing full textual and geographical attributes.

#### 4.3.3 Functional Requirements
* **FR-010:** The system shall display the selected place's name and category on the details view.
* **FR-011:** The system shall display a full textual description of the place.
* **FR-012:** The system shall display opening times if available.
* **FR-013:** The system shall display travel tips if available.
* **FR-014:** The system shall display the place distance in kilometers on the details view.
* **FR-015:** The system shall handle missing optional fields (opening times, travel tips) gracefully without failing and shall display "Not provided" when absent.

### 4.4 Map View (Location Display)
#### 4.4.1 Description and Priority
Shows attraction locations on an interactive map using OpenStreetMap. **Priority: Medium / High**

#### 4.4.2 Stimulus/Response Sequences
1. User opens place details $\rightarrow$ System renders an embedded OpenStreetMap widget centered at the place coordinates with a pin marker.
2. User selects "Open in External Maps" $\rightarrow$ System opens the map coordinates in an external OpenStreetMap/navigation page in a new browser tab.

#### 4.4.3 Functional Requirements
* **FR-016:** The system shall display the selected place location on an interactive map component rendered via OpenStreetMap tiles.
* **FR-017:** The system shall place a visible map marker at the selected place's stored geographic coordinates.
* **FR-018:** The system shall provide an external map link/button to open the location coordinates in a dedicated mapping browser tab.
* **FR-019:** If geographic coordinates are missing, the system shall hide/disable the interactive map component and display a fallback notice.

### 4.5 One-Day Visit Planner
#### 4.5.1 Description and Priority
Allows users to select, manage, and order places for a personalized single-day trip. **Priority: High**

#### 4.5.2 Stimulus/Response Sequences
1. User clicks "Add to Plan" on a place $\rightarrow$ System appends the item to the day plan array.
2. User removes a place $\rightarrow$ System updates and re-indexes the day plan array.
3. User reorders places $\rightarrow$ System reflects the revised itinerary sequence.
4. User views planner summary $\rightarrow$ System calculates total places and total estimated route distance.

#### 4.5.3 Functional Requirements
* **FR-020:** The system shall allow users to add an attraction place to a one-day visit plan.
* **FR-021:** The system shall allow users to remove a place from the active visit plan.
* **FR-022:** The system shall prevent duplicate entries of the same place within a single visit plan.
* **FR-023:** The system shall allow users to reorder places in their active visit plan.
* **FR-024:** The system shall display all planned places in user-selected sequence order.
* **FR-025:** The system shall display a summary block showing total count of selected places and cumulative route metrics.
* **FR-026:** The system shall retain the day plan across the user session at minimum (e.g., using browser LocalStorage or SessionStorage).
* **FR-027 (Optional):** The system shall allow users to clear all entries from the visit plan with a single action.

### 4.6 Admin Authentication & Session Management
#### 4.6.1 Description and Priority
Restricts place creation, editing, and deletion to verified administrators. **Priority: High**

#### 4.6.2 Stimulus/Response Sequences
1. Admin requests access to admin dashboard $\rightarrow$ System prompts for credentials via login form.
2. Admin submits valid credentials $\rightarrow$ System authenticates, stores session token, and grants access.
3. Admin submits invalid credentials $\rightarrow$ System rejects request and logs error notification.

#### 4.6.3 Functional Requirements
* **FR-028:** The system shall enforce authentication before granting access to admin management panels.
* **FR-029:** The system shall present an authentication login form requiring username/email and password fields.
* **FR-030:** The system shall reject invalid login attempts with appropriate feedback.
* **FR-031:** The system shall allow an authenticated admin user to perform a session logout.
* **FR-032:** The backend system shall validate session tokens to block unauthenticated client requests to admin REST endpoints.

### 4.7 Admin Place Management (CRUD)
#### 4.7.1 Description and Priority
Provides administrative capability to create, read, update, and delete database records stored in MongoDB Atlas. **Priority: High**

#### 4.7.2 Stimulus/Response Sequences
1. Admin creates a new place $\rightarrow$ System validates field constraints $\rightarrow$ Persists document to MongoDB Atlas $\rightarrow$ Updates place listing.
2. Admin modifies existing place $\rightarrow$ System updates database document $\rightarrow$ Reflects changes across tourist view.
3. Admin triggers delete $\rightarrow$ System requests confirmation modal $\rightarrow$ Removes document from MongoDB Atlas.

#### 4.7.3 Functional Requirements
* **FR-033:** The system shall allow authorized administrators to create a new place record in MongoDB Atlas.
* **FR-034:** The system shall allow authorized administrators to update existing place properties in MongoDB Atlas.
* **FR-035:** The system shall allow authorized administrators to delete place records from MongoDB Atlas.
* **FR-036:** The system shall trigger a user prompt/confirmation modal before finalizing a place record deletion.
* **FR-037:** The system shall validate mandatory fields before executing database persistence (Name, Category, Description, Coordinates/Address).
* **FR-038:** The system shall store place categories as structured attributes for category filtering logic.
* **FR-039:** The system shall allow admins to input and update optional attributes including opening times and travel tips.
* **FR-040:** The system shall validate that newly added places fall within the maximum allowable 25 km radius from the Ganemulla origin (BR-001) or flag warnings for out-of-bounds locations.

---

## 5. Other Nonfunctional Requirements

### 5.1 Performance Requirements
* **NFR-001:** The system shall render the place listing view within 3 seconds for 95% of server requests under standard demonstration conditions.
* **NFR-002:** Category filtering and search queries shall update client UI views within 1 second of action (excluding background OpenStreetMap tile fetching).
* **NFR-003:** The application architecture shall easily support rendering at least 200 place documents without UI lag or memory leak issues in standard browser engines.

### 5.2 Safety Requirements
* **NFR-004:** The system shall prominently render a disclaimer stating that operating hours, entry rules, and travel tips are subject to change and should be independently verified.

### 5.3 Security Requirements
* **NFR-005:** The backend REST API shall enforce route middleware authentication for all CRUD operations altering data in MongoDB Atlas.
* **NFR-006:** Password records for admin accounts stored in MongoDB Atlas shall be encrypted using secure one-way hashing (e.g., bcrypt).
* **NFR-007:** Application deployment shall run over secure HTTPS transport channels.
* **NFR-008:** Input fields shall incorporate sanitization to mitigate common web security exploits (such as NoSQL injection and Cross-Site Scripting).

### 5.4 Software Quality Attributes
* **NFR-009 (Usability):** The tourist interface shall feature an intuitive Tailwind CSS layout navigable without user manuals for browsing, filtering, and planning tasks.
* **NFR-010 (Reliability):** Missing optional database fields (e.g., travel tips) shall not cause runtime JavaScript exceptions or UI rendering crashes.
* **NFR-011 (Maintainability):** Codebase structure shall separate client-side UI components and backend Node.js API controllers using pure JavaScript (ES6+ standard JavaScript modules without TypeScript compilation requirements).
* **NFR-012 (Portability):** Responsive design powered by Tailwind CSS shall render cleanly across modern standard browsers (Chrome, Edge, Firefox, Safari) and screen form factors.

### 5.5 Business Rules
* **BR-001:** All managed locations must be situated within a 25 km radius of the Ganemulla geographic reference location.
* **BR-002:** Only authenticated administrators may write, edit, or delete database items.
* **BR-003:** The system must pre-populate a seed dataset containing at least 10 baseline regional attraction places upon initial launch.

---

## 6. Other Requirements

* **OR-001 (Data Model Fields):** Each place document saved to MongoDB Atlas shall structure the following data fields:
  * `id` / `_id`: Unique identifier
  * `name`: String (Required)
  * `category`: String (Required)
  * `description`: String (Required)
  * `distance`: Number (Calculated/Stored in km)
  * `coordinates`: `{ latitude: Number, longitude: Number }`
  * `openingHours`: String (Optional)
  * `travelTips`: String (Optional)
* **OR-002 (OpenStreetMap Compliance):** Map tile usage shall abide by OpenStreetMap attribution guidelines, displaying appropriate copyright credits (`© OpenStreetMap contributors`) on map view components.

---

## Appendix A: Initial Seed Places Data

The initial database release for MongoDB Atlas includes the following 10 places located within the ~25 km target travel radius of Ganemulla:

| No | Place Name | Category | Distance | Description |
|---|---|---|---|---|
| 1 | Henarathgoda Botanical Garden | Nature / Botanical Garden | ~4.1 km | Historic botanical garden featuring Sri Lanka's first rubber tree, lush lawns, and walking paths. |
| 2 | Guruge Nature Park | Recreation / Theme Park | ~6.7 km | Family theme park with mini-amusement rides, dinosaur exhibits, and historic replica villages. |
| 3 | Pilikuttuwa Forest & Cave Area | Nature Trekking / Heritage | ~9.9 km | Scenic forest site featuring over 90 natural drip-ledge rock caves and shaded walking trails. |
| 4 | Muthurajawela Wetland Visitor Centre | Eco-Tourism / Nature Sanctuary | ~12.0 km | Protected coastal wetland sanctuary offering guided boat tours through mangrove channels. |
| 5 | Dutch Canal | Colonial Heritage / Waterways | ~13.0 km | Historic 17th-century canal built during the Dutch era, ideal for photography and scenic boat tours. |
| 6 | Kelaniya Raja Maha Viharaya | Architectural Heritage / Religious | ~14.6 km | Sacred historic temple famous for its stone carvings, grand stupa, and detailed wall paintings. |
| 7 | Upali's by Nawaloka | Dining / Authentic Sri Lankan | ~21.0 km | Highly rated restaurant situated near Viharamahadevi Park, famous for traditional Sri Lankan rice & curry and local dishes. |
| 8 | Beddagana Wetland Park | Eco-Tourism / Boardwalk | ~19.5 km | Urban wetland park with elevated wooden boardwalks, butterfly gardens, and bird-watching towers. |
| 9 | Colombo National Museum | Heritage / Museum | ~20.0 km | Sri Lanka's premier museum displaying royal regalia, ancient artifacts, and historical galleries. |
| 10 | Paradise Road The Gallery Café | Dining / International & Fine Dining | ~22.0 km | Iconic restaurant set in Geoffrey Bawa's former office, offering international cuisine and world-class desserts. |

---

## Appendix B: Glossary

* **Admin:** Authorized administrative user who manages dataset items in MongoDB Atlas.
* **Attraction / Place:** Points of interest within a 25 km radius of Ganemulla saved in the system.
* **CRUD:** Create, Read, Update, and Delete database operations.
* **Day Plan / Visit Plan:** User-selected sequence of attraction places organized for a 1-day itinerary.
* **JavaScript (JS):** Core programming language utilized across backend Node.js services and client scripts (strictly avoiding TypeScript).
* **MongoDB Atlas:** Cloud-hosted NoSQL database used to store place documents and user session data.
* **OpenStreetMap (OSM):** Open-source mapping and geospatial data provider used for rendering maps and location markers.
* **Tailwind CSS:** Utility-first CSS framework utilized for all frontend user interface styling and responsive grid layouts.
* **Reference Location:** Ganemulla town center coordinate used as origin for spatial distance metrics.

---

## Appendix C: Analysis Models (Textual & Structural)

### C1. Entity Structure (MongoDB Document Layout)
```javascript
// Place Model Structure (JavaScript / Mongoose)
{
  _id: ObjectId("..."),
  name: "Henarathgoda Botanical Garden",
  category: "Nature",
  description: "Historic botanical garden featuring Sri Lanka's first rubber tree...",
  distanceKm: 4.1,
  location: {
    type: "Point",
    coordinates: [79.9922, 7.0822] // [longitude, latitude]
  },
  openingHours: "8:00 AM - 5:00 PM",
  travelTips: "Best visited during early morning hours for bird watching.",
  createdAt: ISODate("2026-08-18T00:00:00Z")
}
```

### C2. Primary Use Cases
* **UC-01:** Browse catalog of places
* **UC-02:** Filter places by category
* **UC-03:** View detailed place information and OpenStreetMap view
* **UC-04:** Assemble, reorder, and review 1-day visit plan
* **UC-05:** Authenticate admin user
* **UC-06:** Manage places (CRUD via MongoDB Atlas backend)

---

## Appendix D: To Be Determined (TBD) List

1. **TBD-01:** Evaluation of persistent day-plan sharing features (e.g., URL parameters vs LocalStorage session state).
2. **TBD-02:** Standardizing custom tag labels in Tailwind CSS controls for multi-category tagging support.
3. **TBD-03:** Optimization of Leaflet/OpenStreetMap caching layers for offline-friendly mobile usage.