# Periskope Chat App 🚀

A modern, real-time chat application built with **Next.js**, **Tailwind CSS**, **Supabase**, and **TypeScript**.

---

## ✨ Features
- 🔒 **Authentication**: Secure sign up & sign in with email, password, and phone
- 💬 **Real-time Messaging**: Send and receive messages instantly
- 🧑‍🤝‍🧑 **Contacts**: Add, search, and manage contacts with advanced filtering
- 📱 **Responsive Design**: Seamless experience on desktop and mobile
- 🗂️ **Message History**: Effortlessly scroll through your conversation history
- 🕵️‍♂️ **Search Functionality**: Debounced search for contacts and user discovery
- 📬 **Unread Messages**: Instantly filter and find conversations with unread messages
- 🟢 **Message Status**: Track when messages are sent, delivered, and read
- 🖼️ **Pixel-perfect UI**: Clean, modern, and responsive design
- 🧩 **Sidebar & Topbar**: Only visible for authenticated users
- 🖼️ **Screenshots**: *(Add your screenshots below!)*

---

## 🗄️ Database Structure
The application leverages a robust relational schema with the following main tables:

- **profiles**: Stores user profiles, including username, avatar, and phone number
- **messages**: Contains chat messages between users, with status tracking (sent, delivered, read)
- **contacts**: Manages user-to-user connections for contact management

---

## 📁 Folder Structure

```text
periskope/
├── app/                # Next.js app directory (routing, pages, layouts)
│   ├── chats/          # Main chat page
│   ├── auth/           # Auth pages (login, register)
│   └── ...             # Other app routes/layouts
├── components/         # Reusable React components
│   ├── chat/           # Chat UI components (MessageInput, ChatArea, etc.)
│   ├── ui/             # UI elements (Sidebar, Topbar, Icons, etc.)
│   ├── auth/           # Auth forms (SigninForm, SignupForm)
│   ├── utils/          # Utility functions (validation, date, supabase)
│   └── types/          # TypeScript types
├── public/             # Static assets (images, icons)
├── styles/             # Global styles (Tailwind, CSS)
├── types/              # Shared TypeScript types
├── middleware.ts       # Next.js middleware for auth/redirects
├── create-dummy-users.js # Script to seed dummy users
├── README.md           # Project documentation
└── ...                 # Config and setup files
```

**Key Folders:**
- `app/` — All routing and page logic (Next.js App Router)
- `components/` — Modular UI, chat, and utility components
- `public/` — Images and static files
- `styles/` — Tailwind and global CSS
- `types/` — Shared TypeScript types

---

## 📸 Screenshots
<!-- Place your screenshots here -->
![Sign Up](./signup.png)
![Log In](./login.png)
![Chat UI](./chatUI.png)

---

## 🛠️ Tech Stack
- **Frontend:**
  - [Next.js](https://nextjs.org/) (App Router)
  - [Tailwind CSS](https://tailwindcss.com/)
  - [TypeScript](https://www.typescriptlang.org/)
  - [React Icons](https://react-icons.github.io/react-icons/) (Icon components)
- **Backend:**
  - [Supabase](https://supabase.com/) (Backend-as-a-Service)
  - **PostgreSQL** (Database)
  - **Row-Level Security** (Data protection)
- **Authentication:**
  - Supabase Auth
  - Middleware for protected routes

---

## 🚦 Getting Started

### Prerequisites
- Node.js (v18 or newer)
- npm or yarn
- Supabase account

### Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/vipulkatwal/periskopeee.git
   cd periskope
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Set up environment variables:**
   - Create a `.env.local` file in the root directory with the following variables:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```
4. **Set up Supabase:**
   - Create a new Supabase project
   - Run the SQL from `supabase-schema.sql` in the SQL editor to set up the database schema
   - Configure authentication providers in the Supabase dashboard
5. **Run the development server:**
   ```bash
   npm run dev
   ```
6. **Open** [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License
[MIT](LICENSE)
