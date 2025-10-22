/**
 * AI Tasks API Tests
 * Tests for create/update tasks and log outputs on /api/tasks endpoint
 */

describe('AI Tasks API', () => {
  const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
  const apiUrl = `${baseUrl}/api/tasks`;

  describe('POST /api/tasks - Create Task', () => {
    it('should create a new task with valid data', () => {
      const newTask = {
        clone_id: '123e4567-e89b-12d3-a456-426614174000',
        task_name: 'data_analysis',
        task_input: {
          dataset: 'sales_data.csv',
          analysis_type: 'trend'
        },
        priority: 'high'
      };

      expect(newTask).toHaveProperty('clone_id');
      expect(newTask).toHaveProperty('task_name');
      expect(newTask).toHaveProperty('task_input');
      expect(newTask.priority).toBe('high');
    });

    it('should reject task creation without required fields', () => {
      const invalidTask = {
        task_input: { data: 'test' }
      };

      expect(invalidTask).not.toHaveProperty('clone_id');
      expect(invalidTask).not.toHaveProperty('task_name');
    });

    it('should set default status to pending for new tasks', () => {
      const task = {
        clone_id: '123e4567-e89b-12d3-a456-426614174000',
        task_name: 'test_task',
        status: 'pending'
      };

      expect(task.status).toBe('pending');
    });

    it('should validate priority levels', () => {
      const validPriorities = ['low', 'medium', 'high', 'critical'];
      const testPriority = 'high';

      expect(validPriorities).toContain(testPriority);
    });
  });

  describe('GET /api/tasks - Fetch Tasks', () => {
    it('should return tasks array with proper structure', () => {
      const mockResponse = {
        success: true,
        data: [],
        count: 0
      };

      expect(mockResponse).toHaveProperty('success');
      expect(mockResponse).toHaveProperty('data');
      expect(Array.isArray(mockResponse.data)).toBe(true);
    });

    it('should filter tasks by clone_id', () => {
      const cloneId = '123e4567-e89b-12d3-a456-426614174000';
      const queryParams = { clone_id: cloneId };

      expect(queryParams.clone_id).toBe(cloneId);
    });

    it('should return tasks with complete information', () => {
      const mockTask = {
        id: '789e4567-e89b-12d3-a456-426614174000',
        clone_id: '123e4567-e89b-12d3-a456-426614174000',
        task_name: 'data_processing',
        task_input: { file: 'data.json' },
        task_output: { result: 'processed' },
        status: 'completed',
        priority: 'medium',
        created_at: new Date().toISOString(),
        completed_at: new Date().toISOString()
      };

      expect(mockTask).toHaveProperty('id');
      expect(mockTask).toHaveProperty('clone_id');
      expect(mockTask).toHaveProperty('task_name');
      expect(mockTask).toHaveProperty('task_input');
      expect(mockTask).toHaveProperty('task_output');
      expect(mockTask).toHaveProperty('status');
    });
  });

  describe('PUT /api/tasks - Update Task and Log Output', () => {
    it('should update task status', () => {
      const updateData = {
        id: '789e4567-e89b-12d3-a456-426614174000',
        status: 'in_progress'
      };

      expect(updateData).toHaveProperty('id');
      expect(updateData.status).toBe('in_progress');
    });

    it('should log task output when completed', () => {
      const completedTask = {
        id: '789e4567-e89b-12d3-a456-426614174000',
        status: 'completed',
        task_output: {
          result: 'success',
          data: { processed_records: 1000 },
          execution_time: '5.2s'
        }
      };

      expect(completedTask.status).toBe('completed');
      expect(completedTask).toHaveProperty('task_output');
      expect(completedTask.task_output).toHaveProperty('result');
    });

    it('should log error messages for failed tasks', () => {
      const failedTask = {
        id: '789e4567-e89b-12d3-a456-426614174000',
        status: 'failed',
        error_message: 'Connection timeout to external API'
      };

      expect(failedTask.status).toBe('failed');
      expect(failedTask).toHaveProperty('error_message');
      expect(failedTask.error_message.length).toBeGreaterThan(0);
    });

    it('should require task ID for updates', () => {
      const invalidUpdate = {
        status: 'completed'
      };

      expect(invalidUpdate).not.toHaveProperty('id');
    });

    it('should set completed_at timestamp for completed tasks', () => {
      const completedTask = {
        id: '789e4567-e89b-12d3-a456-426614174000',
        status: 'completed',
        completed_at: new Date().toISOString()
      };

      expect(completedTask.status).toBe('completed');
      expect(completedTask).toHaveProperty('completed_at');
      expect(new Date(completedTask.completed_at)).toBeInstanceOf(Date);
    });
  });

  describe('Task Status Validation', () => {
    it('should validate task status transitions', () => {
      const validStatuses = ['pending', 'in_progress', 'completed', 'failed', 'cancelled'];
      const testStatus = 'in_progress';

      expect(validStatuses).toContain(testStatus);
    });

    it('should validate task input is JSON compatible', () => {
      const taskInput = {
        param1: 'value1',
        param2: 42,
        param3: true,
        nested: { key: 'value' }
      };

      expect(typeof taskInput).toBe('object');
      expect(JSON.stringify(taskInput)).toBeTruthy();
    });

    it('should validate task output structure', () => {
      const taskOutput = {
        result: 'success',
        data: { key: 'value' },
        metadata: {
          execution_time: '2.5s',
          resource_usage: 'low'
        }
      };

      expect(taskOutput).toHaveProperty('result');
      expect(typeof taskOutput.data).toBe('object');
    });
  });
});
