import Header from "./Header";

import TodoList from "./TodoList";

export default function Home() {
  return (
    <div className="md:max-w-[500px] mx-auto bg-slate-500 min-h-screen  shadow-2xl shadow-slate-950">
      <Header />
      <TodoList />
    </div>
  );
}
