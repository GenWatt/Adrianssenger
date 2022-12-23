using System.Linq.Expressions;

public interface IRepository<T> where T : class
{
    void Add(T entity);
    bool Any(Expression<Func<T, bool>> expression);
    IQueryable<T> GetWhere(Expression<Func<T, bool>> expression);
    void AddRange(IEnumerable<T> entities);
    void Update(T entity);
    Task<T?> FindOne(Expression<Func<T, bool>> expression);
    IQueryable<T> GetAll();
    Task<T?> GetById(int id);
    void Remove(T entity);
    void RemoveRange(IEnumerable<T> entities);
}