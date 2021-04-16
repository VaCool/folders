import { FoldersService } from './folders.service';

describe('FoldersService', () => {
  const foldersService = new FoldersService();
  beforeAll(() => {
    const commands = [
      'CREATE pats',
      'CREATE pats/dogs',
      'CREATE pats/cats',
      'CREATE fruits',
      'CREATE fruits/apple'
    ];
    for (const command of commands) {
      foldersService.execute(command);
    }
  });
  describe('CREATE', () => {
    it('Should be success with exist path', () => {
      const result = foldersService.execute('CREATE fruits/banana');
      expect(result).toEqual('CREATE fruits/banana');
      expect(foldersService.execute('LIST')).toEqual(
        'LIST\n' + 'pats\n' + ' dogs\n' + ' cats\n' + 'fruits\n' + ' apple\n' + ' banana'
      );
      foldersService.execute('DELETE fruits/banana');
    });

    it('Should be fail with not exist path', () => {
      expect(() => {
        foldersService.execute('CREATE vegetables/carrot');
      }).toThrow('Cannot create vegetables/carrot - vegetables does not exist');
    });

    it('Should be fail with exist path and exist folder', () => {
      expect(() => {
        foldersService.execute('CREATE fruits/apple');
      }).toThrow('Cannot create fruits/apple - apple already exist');
    });
  });

  describe('MOVE', () => {
    beforeAll(() => {
      foldersService.execute('CREATE fruits/parrot');
    });

    it('Should be success', () => {
      const result = foldersService.execute('MOVE fruits/parrot pats');
      expect(result).toEqual('MOVE fruits/parrot pats');
      expect(foldersService.execute('LIST')).toEqual(
        'LIST\n' + 'pats\n' + ' dogs\n' + ' cats\n' + ' parrot\n' + 'fruits\n' + ' apple'
      );
      foldersService.execute('DELETE pats/parrot');
    });

    it('Should be fail with not exist path from move', () => {
      expect(() => {
        foldersService.execute('MOVE fruits/lemon pats');
      }).toThrow('Cannot move fruits/lemon - lemon does not exist');
    });

    it('Should be fail with not exist path to move', () => {
      expect(() => {
        foldersService.execute('MOVE fruits/lemon pats/mouse');
      }).toThrow('Cannot move fruits/lemon - lemon does not exist');
    });
  });

  describe('DELETE', () => {
    beforeAll(() => {
      foldersService.execute('CREATE fruits/banana');
    });

    it('Should be success', () => {
      const result = foldersService.execute('DELETE fruits/banana');
      expect(result).toEqual('DELETE fruits/banana');
    });

    it('Should be fail with not exist path', () => {
      expect(() => {
        foldersService.execute('DELETE vegetables/carrot');
      }).toThrow('Cannot delete vegetables/carrot - vegetables does not exist');
    });
  });

  describe('LIST and incorrect command', () => {
    it('Should be success', () => {
      expect(foldersService.execute('LIST')).toEqual(
        'LIST\n' + 'pats\n' + ' dogs\n' + ' cats\n' + 'fruits\n' + ' apple'
      );
    });

    it('Should be fail with do not exist command', () => {
      expect(() => {
        foldersService.execute('UPDATE something interesting');
      }).toThrow('Command not found: UPDATE something interesting');
    });
  });
});
