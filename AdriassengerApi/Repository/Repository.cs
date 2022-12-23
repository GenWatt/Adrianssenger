using AdriassengerApi.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

public class Repository<T> : IRepository<T> where T : class
{
    protected readonly ApplicationContext _context;
    public Repository(ApplicationContext context)
    {
        _context = context;
    }
    public void Add(T entity)
    {
        _context.Set<T>().Add(entity);
    }
    public IQueryable<T> GetWhere(Expression<Func<T, bool>> expression)
    {
        return _context.Set<T>().Where(expression);
    }
    public void Update(T entity) 
    {
        _context.Entry(entity).State = EntityState.Modified;
    }
    public void AddRange(IEnumerable<T> entities)
    {
        _context.Set<T>().AddRange(entities);
    }
    public async Task<T?> FindOne(Expression<Func<T, bool>> expression)
    {
        return await _context.Set<T>().FirstOrDefaultAsync(expression);
    }
    public IQueryable<T> GetAll()
    {
        return _context.Set<T>();
    }
    public bool Any(Expression<Func<T, bool>> expression)
    {
        return _context.Set<T>().Any(expression);
    }
    public async Task<T?> GetById(int id)
    {
        return await _context.Set<T>().FindAsync(id);
    }
    public void Remove(T entity)
    {
        _context.Set<T>().Remove(entity);
    }
    public void RemoveRange(IEnumerable<T> entities)
    {
        _context.Set<T>().RemoveRange(entities);
    }
}