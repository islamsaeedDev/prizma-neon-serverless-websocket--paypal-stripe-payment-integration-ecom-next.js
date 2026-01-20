function MenuNavigator({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-start gap-3 hidden md:flex md:flex-row ">
      {children}
    </div>
  );
}

export default MenuNavigator;
