export default function CategoryBar({ categories, activeCategory, onChange }) {
  return (
    <div className="category-bar">
      {categories.map((category) => (
        <button
          key={category}
          className={activeCategory === category ? "active" : ""}
          onClick={() => onChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}