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

    public async void Update(T entity) 
    {
        _context.Set<T>().Update(entity);
    }
    public void AddRange(IEnumerable<T> entities)
    {
        _context.Set<T>().AddRange(entities);
    }
    public IEnumerable<T> Find(Expression<Func<T, bool>> expression)
    {
        return _context.Set<T>().Where(expression);
    }
    public IEnumerable<T> GetAll()
    {
        return _context.Set<T>().ToList();
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
    public void UpdateAsync(T entity)
    {
        _context.Entry(entity).State = EntityState.Modified;
    }

    public async Task SaveAsync()
    {
        await _context.SaveChangesAsync();
    }
}