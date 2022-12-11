using System.Linq.Expressions;

public interface IRepository<T> where T : class
{
    void Add(T entity);
    void AddRange(IEnumerable<T> entities);
    public void Update(T entity);
    IEnumerable<T> Find(Expression<Func<T, bool>> expression);
    IEnumerable<T> GetAll();
    Task<T?> GetById(int id);
    void Remove(T entity);
    void RemoveRange(IEnumerable<T> entities);
    Task SaveAsync();
}